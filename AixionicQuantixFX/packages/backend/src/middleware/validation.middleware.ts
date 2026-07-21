import { z } from 'zod'
import { Request, Response, NextFunction } from 'express'

export function validate(schema: z.ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body)
      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        const message = error.errors.map((e) => e.message).join(', ')
        res.status(400).json({ error: message })
      }
    }
  }
}