const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// GET all expenses
app.get('/api/expenses', (req, res) => {
  const sql = 'SELECT * FROM expenses ORDER BY date DESC';
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ data: rows });
  });
});

// POST new expense
app.post('/api/expenses', (req, res) => {
  const { id, name, amount, category, paidBy, date } = req.body;
  const sql = `INSERT INTO expenses (id, name, amount, category, paidBy, date) VALUES (?, ?, ?, ?, ?, ?)`;
  const params = [id, name, amount, category, paidBy, date];
  
  db.run(sql, params, function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: req.body
    });
  });
});

// DELETE expense
app.delete('/api/expenses/:id', (req, res) => {
  const sql = 'DELETE FROM expenses WHERE id = ?';
  db.run(sql, req.params.id, function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ message: 'deleted', changes: this.changes });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});