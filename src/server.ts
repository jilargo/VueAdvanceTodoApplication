// src/server.ts
import express, { Request, Response } from 'express'
import cors from 'cors'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import db from './database/db'
import { auth, AuthRequest } from './middleware/auth'
import multer from 'multer';
import path from 'path';


// Initialize Express
const app = express()
app.use(cors())
app.use(express.json())

const JWT_SECRET = 'CHANGE_THIS_SECRET'

// Type for req.body
interface SignupBody {
  email: string
  password: string
  firstName: string
  lastName: string
}
// ---------- Signup Route ----------
interface SignupBody {
  email: string
  password: string
}
// Setup multer for profile picture
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // make sure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})
const upload = multer({ storage })


// Type for req.body
interface SignupBody {
  email: string
  password: string
  firstName: string
  lastName: string

}
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))
// POST /signup
app.post('/signup', upload.single('profilePicture'), async (req: Request<{}, {}, SignupBody>, res: Response) => {
  try {
    const { email, password, firstName, lastName } = req.body
    const profilePicture = req.file?.path // saved file path

    console.log('Signup request received:', req.body)
    console.log('Uploaded file:', req.file)

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10)

    // Insert into SQLite
    db.run(
      'INSERT INTO users (firstName, lastName, email, password, profilePicture) VALUES (?, ?, ?, ?, ?)',
      [firstName, lastName, email, hashed, profilePicture || null],
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
  firstName: string
  lastName: string
  profilePicture: string | null
}

//for login
app.post('/login', async (req: Request<{}, {}, LoginBody>, res: Response) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  db.get(
    'SELECT id, email, password, firstName, lastName, profilePicture FROM users WHERE email = ?',
    [email],
    async (err, row: UserRow | undefined) => {
      if (err) return res.status(500).json({ error: 'Database error' })
      if (!row) return res.status(400).json({ error: 'User not found' })

      const match = await bcrypt.compare(password, row.password)
      if (!match) return res.status(400).json({ error: 'Invalid password' })

      const token = jwt.sign(
        { id: row.id, email: row.email },
        JWT_SECRET,
        { expiresIn: '1h' }
      )

      res.json({
        token,
        user: {
          firstName: row.firstName,
          lastName: row.lastName,
          profilePicture: row.profilePicture
        }
      })
    }
  )
})

// ---------- Todo Routes ----------
app.post('/todos', auth, (req: AuthRequest, res: Response) => {
  console.log('Auth user:', req.user)
  const { title, date } = req.body
  const userId = req.user?.id
  
  if (!title || !userId || !date) {
    return res.status(400).json({ error: 'Invalid request: title, date, and user required' })
  }

  db.run(
    'INSERT INTO todos (user_id, title, date) VALUES (?, ?, ?)',
    [userId, title, date],
    function (err) {
      if (err) {
        console.error('Failed to insert todo:', err)
        return res.status(500).json({ error: 'Failed to save todo' })
      }

      res.json({
        id: this.lastID,
        title,
        date,
        
      })
    }
  )
})

// GET /todos
app.get('/todos', auth, (req: AuthRequest, res: Response) => {
  const userId = req.user?.id

  db.all(
    'SELECT id, title, date FROM todos WHERE user_id = ? ORDER BY created_at DESC',
    [userId],
    (err, rows: any) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to load todos' })
      }

      res.json(rows)
    }
  )
})

// DELETE a todo (user-scoped)
app.delete('/todos/:id', auth, (req: AuthRequest, res: Response) => {
  const todoId = Number(req.params.id)
  const userId = req.user?.id

  if (!todoId || !userId) {
    return res.status(400).json({ error: 'Invalid request' })
  }

  db.run(
    'DELETE FROM todos WHERE id = ? AND user_id = ?',
    [todoId, userId],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to delete todo' })
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Todo not found' })
      }

      res.json({ success: true })
    }
  )
})

app.listen(3000, () => {
  console.log('Backend running on http://localhost:3000')
})
