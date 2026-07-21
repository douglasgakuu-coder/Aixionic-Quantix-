import { Request, Response, NextFunction } from 'express'
import prisma from '../config/database'
import { createError } from '../middleware/error.middleware'

export class TradingController {
  async getMarkets(req: Request, res: Response, next: NextFunction) {
    try {
      const markets = await prisma.marketDataCache.findMany({
        select: { symbol: true, price: true, change24h: true, volume24h: true },
      })
      res.json({ markets })
    } catch (error) {
      next(error)
    }
  }

  async getPrice(req: Request, res: Response, next: NextFunction) {
    try {
      const { symbol } = req.params
      const market = await prisma.marketDataCache.findUnique({ where: { symbol } })
      res.json({ market })
    } catch (error) {
      next(error)
    }
  }

  async getOrderBook(req: Request, res: Response, next: NextFunction) {
    try {
      const { symbol } = req.params
      const orders = await prisma.order.findMany({
        where: { symbol, status: { in: ['PENDING', 'PARTIALLY_FILLED'] } },
        orderBy: { createdAt: 'desc' },
        take: 100,
      })
      res.json({ orders })
    } catch (error) {
      next(error)
    }
  }

  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req
      const { symbol, type, side, orderType, price, quantity, stopLoss, takeProfit } = req.body

      const order = await prisma.order.create({
        data: {
          userId: user!.userId,
          symbol,
          type,
          side,
          orderType,
          price,
          quantity,
          stopLoss,
          takeProfit,
        },
      })

      res.status(201).json({ order })
    } catch (error) {
      next(error)
    }
  }

  async getOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req
      const orders = await prisma.order.findMany({
        where: { userId: user!.userId },
        orderBy: { createdAt: 'desc' },
        take: 50,
      })
      res.json({ orders })
    } catch (error) {
      next(error)
    }
  }

  async getOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req
      const { id } = req.params

      const order = await prisma.order.findFirst({
        where: { id, userId: user!.userId },
      })

      if (!order) {
        return next(createError('Order not found', 404))
      }

      res.json({ order })
    } catch (error) {
      next(error)
    }
  }

  async cancelOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req
      const { id } = req.params

      const order = await prisma.order.updateMany({
        where: { id, userId: user!.userId, status: 'PENDING' },
        data: { status: 'CANCELLED' },
      })

      if (order.count === 0) {
        return next(createError('Order not found or cannot be cancelled', 404))
      }

      res.json({ message: 'Order cancelled successfully' })
    } catch (error) {
      next(error)
    }
  }

  async getWatchlist(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req
      const watchlist = await prisma.watchlist.findMany({
        where: { userId: user!.userId },
      })
      res.json({ watchlist })
    } catch (error) {
      next(error)
    }
  }

  async addToWatchlist(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req
      const { symbol } = req.body

      const entry = await prisma.watchlist.create({
        data: { userId: user!.userId, symbol },
      })

      res.status(201).json({ entry })
    } catch (error) {
      next(error)
    }
  }

  async removeFromWatchlist(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req
      const { symbol } = req.params

      await prisma.watchlist.deleteMany({
        where: { userId: user!.userId, symbol },
      })

      res.json({ message: 'Removed from watchlist' })
    } catch (error) {
      next(error)
    }
  }
}