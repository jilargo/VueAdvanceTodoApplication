import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = 'CHANGE_THIS_SECRET'

interface JwtUserPayLoad{
  id: number
  email: string
}
export interface AuthRequest extends Request {
  user?: JwtUserPayLoad
  
}

export const auth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authheader = req.headers.authorization
  if (!authheader) return res.status(401).json({ error: 'No token' })

  const token = authheader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Malformed token' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtUserPayLoad
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' })
  }
  

}

