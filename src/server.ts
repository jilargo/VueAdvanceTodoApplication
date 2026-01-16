// src/server.ts
import express, { Request, Response } from 'express'
import cors from 'cors'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import db from './database/db'
import { auth, AuthRequest } from './middleware/auth'

// Initialize Express
const app = express()
app.use(cors())
app.use(express.json())

const JWT_SECRET = 'CHANGE_THIS_SECRET'

// ---------- Signup Route ----------
interface SignupBody {
  email: string
  password: string
}

app.post('/signup', async (req: Request<{}, {}, SignupBody>, res: Response) => {
  try {
    const { email, password } = req.body
    console.log('Signup request received:', req.body)

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10)

    // Insert into SQLite
    db.run(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email, hashed],
      function (this: { lastID: number; changes: number }, err: Error | null) {
        if (err) {
          console.log('DB error:', err)
          return res.status(400).json({ error: 'User already exists or DB error' })
        }
        console.log('User created with id:', this.lastID)
        res.json({ message: 'User created successfully', userId: this.lastID })
      }
    )
  } catch (err: any) {
    console.log('Signup error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})
app.get('/', (req: Request, res: Response) => {
  res.send('Backend is running! Use /signup or /dashboard-data.')
})
// ---------- Protected Dashboard Data ----------
app.get('/dashboard-data', auth, (req: AuthRequest, res: Response) => {
  res.json({ message: 'Protected dashboard data', user: req.user })
})
interface LoginBody {
  email: string
  password: string
}

interface UserRow {
  id: number
  email: string
  password: string
}
//for login
app.post('/login', async (req: Request<{}, {}, LoginBody>, res: Response) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, row: UserRow | undefined) => {
    if (err) return res.status(500).json({ error: 'Database error' })
    if (!row) return res.status(400).json({ error: 'User not found' })

    const match = await bcrypt.compare(password, row.password)
    if (!match) return res.status(400).json({ error: 'Invalid password' })

    const token = jwt.sign({ id: row.id, email: row.email }, JWT_SECRET, { expiresIn: '1h' })
    res.json({ token })
  })
})

// ---------- Start Server ----------
app.listen(3000, () => {
  console.log('Backend running on http://localhost:3000')
})
