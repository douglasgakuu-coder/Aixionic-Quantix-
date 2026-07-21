import { Server, WebSocket } from 'ws'
import { RedisService } from './redis.service'
import { IncomingMessage } from 'http'
import jwt from 'jsonwebtoken'

interface Client {
  ws: WebSocket
  userId?: string
  subscriptions: Set<string>
}

export class WebSocketService {
  private wss: Server
  private clients: Map<string, Client> = new Map()
  private redis: RedisService = new RedisService()

  constructor(server: Server) {
    this.wss = new Server({ server })
  }

  initialize(): void {
    this.wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
      const clientId = this.generateClientId()
      this.clients.set(clientId, { ws, subscriptions: new Set() })

      ws.on('message', (message: Buffer) => {
        this.handleMessage(clientId, message.toString())
      })

      ws.on('close', () => {
        this.clients.delete(clientId)
      })
    })

    this.startMarketDataFeed()
  }

  private generateClientId(): string {
    return Math.random().toString(36).substring(2, 15)
  }

  private handleMessage(clientId: string, message: string): void {
    try {
      const data = JSON.parse(message)
      const client = this.clients.get(clientId)
      if (!client || !data.type) return

      switch (data.type) {
        case 'AUTH':
          this.authenticateClient(clientId, data.token)
          break
        case 'SUBSCRIBE':
          this.subscribeToMarket(clientId, data.symbol)
          break
        case 'UNSUBSCRIBE':
          this.unsubscribeFromMarket(clientId, data.symbol)
          break
      }
    } catch {
      // Invalid message format
    }
  }

  private authenticateClient(clientId: string, token: string): void {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'changeme') as { userId: string }
      const client = this.clients.get(clientId)
      if (client) client.userId = payload.userId
    } catch {
      this.clients.get(clientId)?.ws.close()
    }
  }

  private subscribeToMarket(clientId: string, symbol: string): void {
    const client = this.clients.get(clientId)
    if (client) client.subscriptions.add(symbol)
  }

  private unsubscribeFromMarket(clientId: string, symbol: string): void {
    const client = this.clients.get(clientId)
    if (client) client.subscriptions.delete(symbol)
  }

  private broadcastToSubscribers(symbol: string, data: unknown): void {
    const message = JSON.stringify({ symbol, data })
    this.clients.forEach((client) => {
      if (client.subscriptions.has(symbol)) {
        client.ws.send(message)
      }
    })
  }

  private async startMarketDataFeed(): Promise<void> {
    setInterval(async () => {
      const symbols = ['BTCUSDT', 'ETHUSDT', 'EURUSD', 'GBPUSD']
      for (const symbol of symbols) {
        const price = (Math.random() * 100000).toFixed(2)
        this.broadcastToSubscribers(symbol, { price, timestamp: Date.now() })
      }
    }, 1000)
  }
}