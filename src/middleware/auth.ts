import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = 'CHANGE_THIS_SECRET'

export interface AuthRequest extends Request {
  user?: any
}

export const auth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization
  if (!header) return res.status(401).json({ error: 'No token' })

  const token = header.split(' ')[1]

  try {
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
}
