import express, { Express } from 'express'
import { createServer } from 'http'
import { setupMiddleware } from './config/middleware'
import { logger } from './config/logger'
import { RedisService } from './services/redis.service'
import { WebSocketService } from './services/websocket.service'
import authRoutes from './routes/auth.routes'
import tradingRoutes from './routes/trading.routes'
import walletRoutes from './routes/wallet.routes'
import adminRoutes from './routes/admin.routes'
import { errorHandler } from './middleware/error.middleware'

const app: Express = express()
const server = createServer(app)
const PORT = process.env.PORT || 4000

setupMiddleware(app)

app.use('/api/auth', authRoutes)
app.use('/api/trading', tradingRoutes)
app.use('/api/wallet', walletRoutes)
app.use('/api/admin', adminRoutes)

app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date() }))

app.use(errorHandler)

const redisService = new RedisService()
const wsService = new WebSocketService(server)

server.listen(PORT, async () => {
  await redisService.connect()
  wsService.initialize()
  logger.info(`Server running on port ${PORT}`)
})

export { app, server }