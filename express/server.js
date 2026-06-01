const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise'); // Using promise wrapper for modern async/await
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
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


app.post('/api/generate-quiz', async (req, res) => {
    try {
        // 1. Get the paragraph sent from Angular
        const { courseContent } = req.body;

        if (!courseContent) {
            return res.status(400).json({ success: false, message: "Course content is required" });
        }

        // 2. Initialize the fast, free Gemini 1.5 Flash model
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // 3. Write a strict Prompt Engineering string
        const prompt = `
            You are an expert IT Professor. Read the following course content and generate 5 multiple-choice questions based on it.
            Return the response STRICTLY as a JSON array of objects. Do not include markdown formatting like \`\`\`json.
            Each object must have exactly these keys:
            - "question": The text of the question
            - "options": An array of 4 string options
            - "correctAnswer": The exact string of the correct option

            Course Content: "${courseContent}"
        `;

        // 4. Send to Gemini and wait for the response
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // 5. Clean up any weird formatting Gemini might add and parse it into real JSON
        const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const quizQuestions = JSON.parse(cleanJson);

        // 6. Send the 5 questions back to Angular!
        res.status(200).json({
            success: true,
            data: quizQuestions
        });

    } catch (error) {
        console.error("AI Error Full Details:", error); 
            
            // This will send the exact error message back to your Postman screen!
            res.status(500).json({ 
                success: false, 
                message: "Failed to generate AI quiz.",
                exactError: error.message 
            });
        }
    });


//Save score to database
app.post('/api/save-score', async (req, res) => {
    try {
        // Grab the data Angular sends us
        const { courseId, score, totalQuestions } = req.body;

        // Insert it into the new MySQL table
        const [result] = await db.query(
            'INSERT INTO quiz (courseId, score, totalQuestions) VALUES (?, ?, ?)', 
            [courseId, score, totalQuestions]
        );

        res.status(200).json({ success: true, message: "Score saved permanently!" });
    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({ success: false, message: "Failed to save score." });
    }
});


// ----------------------------------------------------
// PHASE 5: IDENTITY & SECURITY (REGISTER)
// ----------------------------------------------------
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Hash the password securely (10 is the salt rounds)
        const hashedPassword = await bcrypt.hash(password, 10);

        // 2. Insert the user into the database
        const [result] = await db.query(
            'INSERT INTO users (userName, userEmail, userPassword, userStatus, quizCompleted) VALUES (?, ?, ?,"active",0)', 
            [name, email, hashedPassword]
        );

        res.status(201).json({ success: true, message: "User registered successfully!" });
    } catch (error) {
        console.error("Registration Error:", error);
        // Error 1062 is MySQL's code for a duplicate entry (e.g., email already exists)
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ success: false, message: "Email already in use." });
        } else {
            res.status(500).json({ success: false, message: "Registration failed." });
        }
    }
});

// ----------------------------------------------------
// PHASE 5: IDENTITY & SECURITY (LOGIN)
// ----------------------------------------------------
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check if the user exists
        const [users] = await db.query('SELECT * FROM users WHERE userEmail = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ success: false, message: "Invalid email or password." });
        }
        const user = users[0];

        // 2. Compare the typed password with the hashed password in DB
        const isMatch = await bcrypt.compare(password, user.userPassword);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid email or password." });
        }

        // 3. Generate the JWT! (Valid for 24 hours)
        const token = jwt.sign(
            { userId: user.userId, email: user.userEmail, role: 'student' }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );

        // 4. Send the token back to Angular
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

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});