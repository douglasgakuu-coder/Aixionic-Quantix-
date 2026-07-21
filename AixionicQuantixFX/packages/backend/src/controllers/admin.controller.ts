import { Request, Response, NextFunction } from 'express'
import prisma from '../config/database'

export class AdminController {
  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await prisma.user.findMany({
        select: { id: true, email: true, firstName: true, lastName: true, status: true, role: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 100,
      })
      res.json({ users })
    } catch (error) {
      next(error)
    }
  }

  async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const user = await prisma.user.findUnique({
        where: { id },
        select: { id: true, email: true, firstName: true, lastName: true, status: true, role: true, createdAt: true },
      })
      res.json({ user })
    } catch (error) {
      next(error)
    }
  }

  async updateUserStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const { status } = req.body

      const user = await prisma.user.update({
        where: { id },
        data: { status },
      })

      res.json({ user })
    } catch (error) {
      next(error)
    }
  }

  async getKYCApplications(req: Request, res: Response, next: NextFunction) {
    try {
      const kycApplications = await prisma.kyc.findMany({
        where: { status: 'PENDING' },
        include: { user: { select: { email: true, firstName: true, lastName: true } } },
        orderBy: { submittedAt: 'desc' },
      })
      res.json({ kycApplications })
    } catch (error) {
      next(error)
    }
  }

  async updateKYCStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const { status, rejectionReason } = req.body

      const kyc = await prisma.kyc.update({
        where: { id },
        data: {
          status,
          rejectionReason,
          verifiedAt: status === 'VERIFIED' ? new Date() : undefined,
          rejectedAt: status === 'REJECTED' ? new Date() : undefined,
        },
      })

      res.json({ kyc })
    } catch (error) {
      next(error)
    }
  }

  async getAllTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const transactions = await prisma.transaction.findMany({
        include: { user: { select: { email: true } } },
        orderBy: { createdAt: 'desc' },
        take: 100,
      })
      res.json({ transactions })
    } catch (error) {
      next(error)
    }
  }

  async getAllWallets(req: Request, res: Response, next: NextFunction) {
    try {
      const wallets = await prisma.wallet.findMany({
        include: { user: { select: { email: true } } },
      })
      res.json({ wallets })
    } catch (error) {
      next(error)
    }
  }

  async getAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const totalUsers = await prisma.user.count()
      const totalVolume = await prisma.transaction.aggregate({
        _sum: { amount: true },
        where: { status: 'COMPLETED' },
      })
      const activeOrders = await prisma.order.count({ where: { status: 'PENDING' } })

      res.json({
        totalUsers,
        totalVolume: totalVolume._sum.amount,
        activeOrders,
      })
    } catch (error) {
      next(error)
    }
  }

  async getRevenueReport(req: Request, res: Response, next: NextFunction) {
    try {
      const dailyRevenue = await prisma.$queryRaw`
        SELECT DATE(created_at) as date, SUM(amount) as revenue
        FROM "Transaction"
        WHERE status = 'COMPLETED'
        GROUP BY DATE(created_at)
        ORDER BY date DESC
        LIMIT 30
      `

      res.json({ dailyRevenue })
    } catch (error) {
      next(error)
    }
  }

  async getSupportTickets(req: Request, res: Response, next: NextFunction) {
    try {
      const tickets = await prisma.supportTicket.findMany({
        include: { user: { select: { email: true } } },
        orderBy: { createdAt: 'desc' },
        take: 50,
      })
      res.json({ tickets })
    } catch (error) {
      next(error)
    }
  }

  async updateSupportTicket(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const { status, response } = req.body

      const ticket = await prisma.supportTicket.update({
        where: { id },
        data: { status, response, respondedAt: response ? new Date() : undefined },
      })

      res.json({ ticket })
    } catch (error) {
      next(error)
    }
  }
}