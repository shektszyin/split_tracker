const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to SQLite database file
const dbPath = path.resolve(__dirname, 'expenses.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database ' + dbPath + ': ' + err.message);
  } else {
    console.log('Connected to the SQLite database.');
    initDb();
  }
});

// Initialize table
function initDb() {
  db.run(`CREATE TABLE IF NOT EXISTS expenses (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    amount REAL NOT NULL,
    category TEXT NOT NULL,
    paidBy TEXT NOT NULL,
    date TEXT NOT NULL
  )`);
}

module.exports = db;