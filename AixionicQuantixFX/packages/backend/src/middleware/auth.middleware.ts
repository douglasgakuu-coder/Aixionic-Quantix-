import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { createError } from './error.middleware'

interface JwtPayload {
  userId: string
  email: string
  role: string
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload
    }
  }
}

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const token = req.cookies.accessToken || req.header('Authorization')?.replace('Bearer ', '')

  if (!token) {
    return next(createError('Access token required', 401))
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET || 'changeme'
    ) as JwtPayload

    req.user = payload
    next()
  } catch {
    return next(createError('Invalid or expired token', 401))
  }
}

export function authorize(...roles: string[]) {
  return (_req: Request, _res: Response, next: NextFunction): void => {
    const user = _req.user
    if (!user || !roles.includes(user.role)) {
      return next(createError('Insufficient permissions', 403))
    }
    next()
  }
}

export function generateTokens(userId: string, email: string, role: string) {
  const payload = { userId, email, role }

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET || 'changeme', {
    expiresIn: '15m',
  })

  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET || 'changeme_refresh', {
    expiresIn: '7d',
  })

  return { accessToken, refreshToken }
}