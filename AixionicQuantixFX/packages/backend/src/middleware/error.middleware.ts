import { Request, Response, NextFunction } from 'express'

export interface ApiError extends Error {
  statusCode?: number
  isOperational?: boolean
}

export function errorHandler(
  err: ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err.statusCode || 500
  const message = err.isOperational ? err.message : 'Internal Server Error'

  res.status(statusCode).json({
    error: {
      message,
      status: statusCode,
      timestamp: new Date().toISOString(),
    },
  })
}

export function createError(message: string, statusCode: number): ApiError {
  const error = new Error(message) as ApiError
  error.statusCode = statusCode
  error.isOperational = true
  return error
}