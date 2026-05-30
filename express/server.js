const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise'); // Using promise wrapper for modern async/await
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Crucial: Allows Angular to talk to Express
app.use(express.json()); // Allows Express to read JSON bodies

// Database Connection Pool (from Slide 43)
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD ,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test Route: Phase 2 Milestone (GET /api/courses)
app.get('/api/users', async (req, res) => {
    try {
        // Query the database for the dummy course you inserted
        const [rows] = await db.query('SELECT * FROM users');
        
        res.status(200).json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Database connection failed" });
    }
});

app.get('/api/courses', async (req, res) => {
    try {
        // Query the database for the dummy course you inserted
        const [rows] = await db.query('SELECT * FROM courses');
        
        res.status(200).json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Database connection failed" });
    }
});
// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});