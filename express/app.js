const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;

const db = require('./config/db');

//routing
const authRoutes = require('./routes/auth/auth');
const adminRoutes = require('./routes/admin/admin');
const courseRoutes = require('./routes/courses/courses');

// middleware
const verifyToken = require('./middleware/auth');
const requireAdmin = require('./middleware/requireAdmin');


app.use(cors()); // Crucial: Allows Angular to talk to Express
app.use(express.json()); // Allows Express to read JSON bodies

// Auth Routes (Login/Register)
app.use('/api', authRoutes);

//  MOUNT THE COURSES ROUTER
app.use('/api/courses', courseRoutes);

// protected Admin Routes (Create Course, View All Scores)
app.use('/api/admin', verifyToken, requireAdmin, adminRoutes);


// // Test Route: Phase 2 Milestone (GET /api/courses
// app.get('/api/users', async (req, res) => {
//     try {
//         // Query the database for the dummy course you inserted
//         const [rows] = await db.query('SELECT * FROM users');
        
//         res.status(200).json({
//             success: true,
//             data: rows
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: "Database connection failed" });
//     }
// });


// Start Server
// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });

module.exports = app;