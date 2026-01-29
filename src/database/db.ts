import sqlite3 from 'sqlite3'
import path from 'path'

// Use verbose mode for better debugging
sqlite3.verbose()

// Create or open the database file in the project root
const dbPath = path.resolve(__dirname, '../database.db')
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err)
  } else {
    console.log('Connected to SQLite database at', dbPath)
  }
})
db.run(`
  DROP TABLE IF EXISTS todos
`, (err) => {
  if (err) {
    console.error('Error dropping todos table:', err)
  } else {
    console.log('Todos table dropped successfully')
  }
})

// Create users table if it doesn't exist
db.serialize(() => {
  // db.run(`DROP TABLE IF EXISTS users`, (err) => {
  //   if (err) console.error(err)
  //   else console.log('Users table dropped')
  // })
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstName TEXT,
      lastName TEXT,
      profilePicture TEXT,
      email TEXT UNIQUE,
      password TEXT,
      
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating users table:', err)
    } else {
      console.log('Users table ready')
    }

    // Create todos table if it doesn't exist
  })
  db.run(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    title TEXT,
    date TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`, (err) => {
  if (err) {
    console.error('Error creating todos table:', err)
  } else {
    console.log('Todos table ready')
  }
})

})

export default db
