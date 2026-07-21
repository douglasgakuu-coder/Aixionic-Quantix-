import Redis from 'ioredis'

export class RedisService {
  private client: Redis | null = null

  async connect(): Promise<void> {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'

    this.client = new Redis(redisUrl, {
      retryStrategy: (times) => Math.min(times * 50, 2000),
    })

    this.client.on('error', (err) => console.error('Redis error:', err))
    this.client.on('connect', () => console.log('Redis connected'))
  }

  async get(key: string): Promise<string | null> {
    return this.client?.get(key) || null
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.client?.set(key, value, 'EX', ttl)
    } else {
      await this.client?.set(key, value)
    }
  }

  async del(key: string): Promise<void> {
    await this.client?.del(key)
  }

  async publish(channel: string, message: string): Promise<void> {
    await this.client?.publish(channel, message)
  }

  async subscribe(channel: string, callback: (message: string) => void): Promise<void> {
    const sub = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')
    sub.subscribe(channel)
    sub.on('message', (_chan, message) => callback(message))
  }
}