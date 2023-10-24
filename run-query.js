// * You do not have to understand this file in order to study SQL
// However, if you're a keen developer, read on.
// Here's the documentation: https://teach.codedamn.com/docs/technologies/sqlite

// Usage: node run-query.js <path to sqlite db> <path to query file>
// Example: node run-query.js ./database.sqlite ./query.sql

import Database from 'better-sqlite3'
import fs from 'fs'
import clc from 'cli-color'

// Function to execute a query and collect results
const executeQuery = (query) => {
	const grayLog = clc.xterm(8)
	const redLog = clc.xterm(9)

	console.log(grayLog(`--- Executing query: ${query.trim()} ---`))
	let output = null
	try {
		if (query.trim().toUpperCase().startsWith('SELECT')) {
			output = db.prepare(query).all()
		} else {
			output = db.prepare(query).run()
		}
	} catch (err) {
		output = redLog(`Error: ${err.message}`)
	}
	console.log(output)
	console.log(grayLog(`--- Query execution complete ---`))
}

const databasePath = process.argv[2]
const commandFilePath = process.argv[3]

if (!databasePath || !commandFilePath) {
	console.log(
		`Usage: node run-query.js <path to sqlite db> <path to query file>`
	)
	process.exit(1)
}

if (!fs.existsSync(commandFilePath)) {
	console.log(`SQL file not found. Searching for file: ${commandFilePath}`)
	console.log(
		`Usage: node run-query.js <path to sqlite db> <path to query file>`
	)
	process.exit(1)
}

const sqlContent = fs.readFileSync(commandFilePath, 'utf-8')
const db = new Database(databasePath)

const queries = sqlContent.split(/;\s*$/m)

let accumulatedQuery = ''
for (const line of queries) {
	const cleanedLine = line.split('--')[0].trim()

	// Accumulate lines for a complete SQL statement
	if (cleanedLine) {
		accumulatedQuery += cleanedLine + ' '
	}

	// Execute when a complete SQL statement is accumulated
	if (cleanedLine.endsWith(';')) {
		executeQuery(accumulatedQuery)
		accumulatedQuery = ''
	}
}

if (accumulatedQuery.trim()) {
	executeQuery(accumulatedQuery)
}

db.close()
