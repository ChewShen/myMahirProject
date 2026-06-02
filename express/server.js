const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const app = express();
const PORT = process.env.PORT || 3000;

const db = require('./config/db');

const authRoutes = require('./routes/auth/auth');
const verifyToken = require('./middleware/auth');
const requireAdmin = require('./middleware/requireAdmin');

// Middleware
app.use(cors()); // Crucial: Allows Angular to talk to Express
app.use(express.json()); // Allows Express to read JSON bodies
app.use('/api', authRoutes);


// Test Route: Phase 2 Milestone (GET /api/courses
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
app.post('/api/save-score', verifyToken, async (req, res) => {
    try {
        // Grab the data Angular sends us
        // const { courseId, score, totalQuestions } = req.body;
        const userId = req.user.userId;
        const { courseId, score, totalQuestions } = req.body;

        // Insert it into the new MySQL table
        const [result] = await db.query(
            'INSERT INTO quiz (userId, courseId, score, totalQuestions) VALUES (?, ?, ?, ?)', 
            [userId, courseId, score, totalQuestions]
        );

        res.status(200).json({ success: true, message: "Score saved permanently!" });
    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({ success: false, message: "Failed to save score." });
    }
});

app.get('/api/admin/all-scores', verifyToken, requireAdmin, async (req, res) => {
    // Only admins can execute this code!
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});