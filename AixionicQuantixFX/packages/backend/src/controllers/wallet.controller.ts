import { Request, Response, NextFunction } from 'express'
import prisma from '../config/database'
import { createError } from '../middleware/error.middleware'
import crypto from 'crypto'

export class WalletController {
  async getWallets(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req
      const wallets = await prisma.wallet.findMany({
        where: { userId: user!.userId },
        select: { id: true, currency: true, balance: true, address: true, isWhitelisted: true },
      })
      res.json({ wallets })
    } catch (error) {
      next(error)
    }
  }

  async getWallet(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req
      const { currency } = req.params

      const wallet = await prisma.wallet.findUnique({
        where: { userId_currency: { userId: user!.userId, currency } },
      })

      if (!wallet) {
        return next(createError('Wallet not found', 404))
      }

      res.json({ wallet })
    } catch (error) {
      next(error)
    }
  }

  async generateDepositAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req
      const { currency } = req.body

      let wallet = await prisma.wallet.findUnique({
        where: { userId_currency: { userId: user!.userId, currency } },
      })

      if (!wallet) {
        wallet = await prisma.wallet.create({
          data: { userId: user!.userId, currency, balance: 0 },
        })
      }

      if (!wallet.address) {
        const address = this.generateCryptoAddress(currency)
        wallet = await prisma.wallet.update({
          where: { id: wallet.id },
          data: { address },
        })
      }

      res.json({ address: wallet.address, currency })
    } catch (error) {
      next(error)
    }
  }

  async withdraw(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req
      const { currency, amount, address } = req.body

      const wallet = await prisma.wallet.findUnique({
        where: { userId_currency: { userId: user!.userId, currency } },
      })

      if (!wallet) {
        return next(createError('Wallet not found', 404))
      }

      if (!wallet.isWhitelisted) {
        return next(createError('Address not whitelisted', 403))
      }

      if (wallet.balance < Number(amount)) {
        return next(createError('Insufficient balance', 400))
      }

      const withdrawal = await prisma.withdrawalRequest.create({
        data: {
          walletId: wallet.id,
          amount,
          address,
          status: 'PENDING',
        },
      })

      await prisma.wallet.update({
        where: { id: wallet.id },
        data: { balance: { decrement: Number(amount) } },
      })

      res.status(201).json({ withdrawal })
    } catch (error) {
      next(error)
    }
  }

  async getTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req
      const transactions = await prisma.transaction.findMany({
        where: { userId: user!.userId },
        orderBy: { createdAt: 'desc' },
        take: 50,
      })
      res.json({ transactions })
    } catch (error) {
      next(error)
    }
  }

  private generateCryptoAddress(currency: string): string {
    const prefix = currency.toLowerCase()
    const random = crypto.randomBytes(20).toString('hex')
    return `${prefix}${random}`
  }
}