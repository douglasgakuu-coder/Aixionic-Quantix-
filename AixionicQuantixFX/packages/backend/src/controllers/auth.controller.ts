import { Request, Response, NextFunction } from 'express'
import prisma from '../config/database'
import jwt from 'jsonwebtoken'
import argon2 from 'argon2'
import argon2 from 'argon2'
import { sendEmail } from '../services/email.service'
import { generateTokens } from '../middleware/auth.middleware'
import speakeasy from 'speakeasy'
import qrcode from 'qrcode'
import { z } from 'zod'

export class AuthController {
  registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
  })

  loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
    totp: z.string().optional(),
  })

  resetPasswordSchema = z.object({
    token: z.string(),
    password: z.string().min(8),
  })

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, firstName, lastName } = req.body

      const existingUser = await prisma.user.findUnique({ where: { email } })
      if (existingUser) {
        return res.status(409).json({ error: 'Email already registered' })
      }

      const passwordHash = await argon2.hash(password)

      const user = await prisma.user.create({
        data: {
          email,
          passwordHash,
          firstName,
          lastName,
          status: 'PENDING_VERIFICATION',
        },
      })

      const verificationToken = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || 'changeme',
        { expiresIn: '24h' }
      )

      await sendEmail({
        to: user.email,
        subject: 'Verify your email',
        template: 'email-verification',
        variables: { token: verificationToken },
      })

      res.status(201).json({ message: 'Registration successful. Check your email.' })
    } catch (error) {
      next(error)
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, totp } = req.body

      const user = await prisma.user.findUnique({ where: { email } })
      if (!user || !user.passwordHash) {
        return res.status(401).json({ error: 'Invalid credentials' })
      }

      const valid = await argon2.verify(user.passwordHash, password)
      if (!valid) {
        return res.status(401).json({ error: 'Invalid credentials' })
      }

      if (user.isTwoFactorEnabled && totp) {
        const verified = speakeasy.totp.verify({
          secret: user.twoFactorSecret,
          encoding: 'base32',
          token: totp,
        })
        if (!verified) {
          return res.status(401).json({ error: 'Invalid 2FA code' })
        }
      }

      const { accessToken, refreshToken } = generateTokens(user.id, user.email, user.role)

      await prisma.session.create({
        data: {
          userId: user.id,
          token: refreshToken,
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      })

      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      })

      res
        .cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'strict' })
        .cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'strict' })
        .json({ user: { email: user.email, firstName: user.firstName, lastName: user.lastName } })
    } catch (error) {
      next(error)
    }
  }

  async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.body

      const payload = jwt.verify(token, process.env.JWT_SECRET || 'changeme') as { userId: string }

      await prisma.user.update({
        where: { id: payload.userId },
        data: { status: 'ACTIVE', emailVerifiedAt: new Date() },
      })

      res.json({ message: 'Email verified successfully' })
    } catch (error) {
      next(error)
    }
  }

  async resendVerification(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body
      const user = await prisma.user.findUnique({ where: { email } })

      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      if (user.status === 'ACTIVE') {
        return res.json({ message: 'Email already verified' })
      }

      const verificationToken = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || 'changeme',
        { expiresIn: '24h' }
      )

      await sendEmail({
        to: user.email,
        subject: 'Verify your email',
        template: 'email-verification',
        variables: { token: verificationToken },
      })

      res.json({ message: 'Verification email sent' })
    } catch (error) {
      next(error)
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body
      const user = await prisma.user.findUnique({ where: { email } })

      if (user) {
        const resetToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'changeme', {
          expiresIn: '1h',
        })

        await sendEmail({
          to: user.email,
          subject: 'Reset your password',
          template: 'reset-password',
          variables: { token: resetToken },
        })
      }

      res.json({ message: 'If email exists, reset link sent' })
    } catch (error) {
      next(error)
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, password } = req.body

      const payload = jwt.verify(token, process.env.JWT_SECRET || 'changeme') as { userId: string }

      const passwordHash = await argon2.hash(password)

      await prisma.user.update({
        where: { id: payload.userId },
        data: { passwordHash },
      })

      res.json({ message: 'Password reset successfully' })
    } catch (error) {
      next(error)
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies

      if (!refreshToken) {
        return res.status(401).json({ error: 'Refresh token required' })
      }

      const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'changeme_refresh') as {
        userId: string
      }

      const session = await prisma.session.findUnique({
        where: { token: refreshToken },
      })

      if (!session || session.expiresAt < new Date()) {
        return res.status(401).json({ error: 'Invalid refresh token' })
      }

      const user = await prisma.user.findUnique({ where: { id: payload.userId } })
      if (!user) {
        return res.status(401).json({ error: 'User not found' })
      }

      const tokens = generateTokens(user.id, user.email, user.role)

      await prisma.session.update({
        where: { token: refreshToken },
        data: { token: tokens.refreshToken, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
      })

      res
        .cookie('accessToken', tokens.accessToken, { httpOnly: true, secure: true, sameSite: 'strict' })
        .cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: true, sameSite: 'strict' })
        .json({ message: 'Token refreshed' })
    } catch (error) {
      next(error)
    }
  }

  async enable2FA(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req
      if (!user) return res.status(401).json({ error: 'Unauthorized' })

      const secret = speakeasy.generateSecret({ name: `QuantixFX (${user.email})` })

      await prisma.user.update({
        where: { id: user.userId },
        data: { twoFactorSecret: secret.base32 },
      })

      const qrCode = await qrcode.toDataURL(secret.otpauth_url!)

      res.json({ qrCode, secret: secret.base32 })
    } catch (error) {
      next(error)
    }
  }

  async verify2FA(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req
      const { totp } = req.body
      if (!user) return res.status(401).json({ error: 'Unauthorized' })

      const dbUser = await prisma.user.findUnique({ where: { id: user.userId } })
      if (!dbUser?.twoFactorSecret) {
        return res.status(400).json({ error: '2FA not enabled' })
      }

      const verified = speakeasy.totp.verify({
        secret: dbUser.twoFactorSecret,
        encoding: 'base32',
        token: totp,
      })

      if (!verified) {
        return res.status(401).json({ error: 'Invalid 2FA code' })
      }

      await prisma.user.update({
        where: { id: user.userId },
        data: { isTwoFactorEnabled: true },
      })

      res.json({ message: '2FA enabled successfully' })
    } catch (error) {
      next(error)
    }
  }

  async disable2FA(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req
      if (!user) return res.status(401).json({ error: 'Unauthorized' })

      await prisma.user.update({
        where: { id: user.userId },
        data: { twoFactorSecret: null, isTwoFactorEnabled: false },
      })

      res.json({ message: '2FA disabled successfully' })
    } catch (error) {
      next(error)
    }
  }

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req
      if (!user) return res.status(401).json({ error: 'Unauthorized' })

      const dbUser = await prisma.user.findUnique({
        where: { id: user.userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          status: true,
          isTwoFactorEnabled: true,
          role: true,
        },
      })

      res.json({ user: dbUser })
    } catch (error) {
      next(error)
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies

      if (refreshToken) {
        await prisma.session.deleteMany({ where: { token: refreshToken } })
      }

      res
        .clearCookie('accessToken')
        .clearCookie('refreshToken')
        .json({ message: 'Logged out successfully' })
    } catch (error) {
      next(error)
    }
  }
}