const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 3000;

// Middleware
const corsOptions = {
    origin: '*', // Permet toutes les origines pendant le développement.
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type'],
};
app.use(cors(corsOptions));


app.use(express.json());


const db = new sqlite3.Database('./tasks.db', (err) => {
    if (err) {
        return console.error('Error connecting to the database:', err.message);
    }
    console.log('Connected to the SQLite database.');
});

// Routes
app.get('/tasks', (req, res) => {
    db.all('SELECT * FROM tasks', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.post('/tasks', (req, res) => {
    const { description, category, points } = req.body;
    if (!description || !category || !points) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const query = `INSERT INTO tasks (description, category, points) VALUES (?, ?, ?)`;
    const params = [description, category, points];

    db.run(query, params, function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({
            id: this.lastID,
            description: description,
            category: category,
            points: points
        });
    });
});

app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM tasks WHERE id = ?', id, function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Task deleted' });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
