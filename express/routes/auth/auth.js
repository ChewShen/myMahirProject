const express = require ('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const db = require('../../config/db');
const router = express.Router();


router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.query(
            'INSERT INTO users (userName, userEmail, userPassword, userStatus, quizCompleted) VALUES (?, ?, ?, "active", 0)', 
            [name, email, hashedPassword]
        );

        res.status(201).json({ success: true, message: "User registered successfully!" });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ success: false, message: "Email already in use." });
        } else {
            res.status(500).json({ success: false, message: "Registration failed." });
        }
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const [users] = await db.query('SELECT * FROM users WHERE userEmail = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ success: false, message: "Invalid email or password." });
        }
        
        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.userPassword);
        
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid email or password." });
        }

        const token = jwt.sign(
            { userId: user.userId, email: user.userEmail, role: 'student' }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );

        res.status(200).json({ 
            success: true, 
            message: "Login successful!",
            token: token,
            user: { id: user.userId, name: user.userName, email: user.userEmail }
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ success: false, message: "Login failed." });
    }
});

// 3. Export the router so server.js can use it!
module.exports = router;