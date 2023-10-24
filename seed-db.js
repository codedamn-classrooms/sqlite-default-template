// Import better-sqlite3 and create a database connection
import Database from 'better-sqlite3'
import fs from 'fs'

// Reset database
const databasePath = './database.sqlite'

if (fs.existsSync(databasePath)) fs.unlinkSync(databasePath)

const db = new Database(databasePath)

// Seed your database here. For example:

/*
// Create a table
db.exec(
	`CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL)`
)

// Insert data
db.prepare(`INSERT INTO users (name) VALUES ('Alice')`)
*/

// Close the database
db.close()
