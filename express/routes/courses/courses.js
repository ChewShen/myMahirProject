const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Adjust path if needed
const { GoogleGenerativeAI } = require('@google/generative-ai');

const verifyToken = require('../middleware/auth');

// GET ALL COURSES
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM courses');
        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Database connection failed" });
    }
});

// GET SPECIFIC COURSE BY ID
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const courseId = req.params.id; 
        const [rows] = await db.query('SELECT * FROM courses WHERE courseId = ?', [courseId]);
        
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }
        res.status(200).json({ success: true, data: rows[0] }); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Database connection failed" });
    }
});

// 3. GENERATE AI QUIZ
router.post('/generate-quiz', verifyToken, async (req, res) => {
    try {
        const { courseContent } = req.body;
        if (!courseContent) return res.status(400).json({ success: false, message: "Course content is required" });

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
            You are an expert IT Professor. Read the following course content and generate 5 multiple-choice questions based on it.
            Return the response STRICTLY as a JSON array of objects. Do not include markdown formatting like \`\`\`json.
            Each object must have exactly these keys:
            - "question": The text of the question
            - "options": An array of 4 string options
            - "correctAnswer": The exact string of the correct option

            Course Content: "${courseContent}"
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const quizQuestions = JSON.parse(cleanJson);

        res.status(200).json({ success: true, data: quizQuestions });
    } catch (error) {
        console.error("AI Error Full Details:", error); 
        res.status(500).json({ success: false, message: "Failed to generate AI quiz.", exactError: error.message });
    }
});

// SAVE SCORE
router.post('/save-score', verifyToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { courseId, score, totalQuestions } = req.body;

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

module.exports = router;