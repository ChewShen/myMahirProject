const express = require('express');
const router = express.Router();
const db = require('../../config/db'); 
const { GoogleGenerativeAI } = require('@google/generative-ai');

const verifyToken = require('../../middleware/auth');



// GET ALL COURSES
router.get('/', verifyToken, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM courses');
        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Database connection failed" });
    }
});

// GET YOUR PERSONAL SCORES
// URL will be: GET /api/courses/my-scores
router.get('/my-scores', verifyToken, async (req, res) => {
    try {
        // Because of verifyToken, we know EXACTLY who is asking!
        const userId = req.user.userId; 

        // We use a SQL JOIN so we can get the actual Course Name, not just the ID number
        const query = `
            SELECT courses.courseName, quiz.score, quiz.totalQuestions 
            FROM quiz
            JOIN courses ON quiz.courseId = courses.courseId
            WHERE quiz.userId = ? 
            ORDER BY quiz.quizId DESC
        `;
        
        const [results] = await db.query(query, [userId]);
        res.status(200).json({ success: true, data: results });
    } catch (err) {
        console.error("Profile DB Error:", err);
        res.status(500).json({ success: false, message: "Failed to fetch your scores." });
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

        const cleanJson = responseText
                        .replace(/```json\n?/gi, '')
                        .replace(/```\n?/g, '')
                        .trim();
        try {
            const quizQuestions = JSON.parse(cleanJson);
            // If parsing succeeds, return the dynamic structured array layout payload
            return res.status(200).json({ success: true, data: quizQuestions });
        } catch (parseError) {
            // Logs out format structure discrepancies securely inside Docker logs
            console.error("Malformed AI JSON String detected! Raw output was:", responseText);
            
            // Catches the formatting failure gracefully instead of throwing a 500 error
            return res.status(422).json({ 
                success: false, 
                message: "The AI generated an unstable data format structure. Please click the button to try again!",
                errorDetails: parseError.message 
            });
        }

        res.status(200).json({ success: true, data: quizQuestions });
    } catch (error) {
        console.error("AI Error Full Details:", error); 
        res.status(500).json({ success: false, message: "Failed to generate AI quiz.", exactError: error.message });
    }
});

// Add this in your routes file alongside router.post('/generate-quiz')
router.post('/explain-batch', verifyToken, async (req, res) => {
    try {
        const { wrongAnswers } = req.body;

        if (!wrongAnswers || !Array.isArray(wrongAnswers) || wrongAnswers.length === 0) {
            return res.status(400).json({ success: false, message: "No incorrect answers provided for analysis." });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Using the gemini-2.5-flash model matching your configuration
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Since we are enforcing JSON format via prompting to keep dependencies minimal:
        const prompt = `
            You are a friendly, encouraging IT tutor. Review the following list of quiz errors made by a student.
            For each item, provide a clear, constructive 2-3 sentence explanation detailing why the correct answer is right and why the student's selection was incorrect.
            
            Return the response STRICTLY as a JSON object with a single root key called "explanations", which contains an array of objects. Do not include markdown formatting like \`\`\`json.
            Each object in the array must have exactly these keys:
            - "question": The exact text of the question being evaluated.
            - "explanation": Your friendly, constructive explanation.

            Incorrect Submission Dataset:
            ${JSON.stringify(wrongAnswers)}
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Using your existing cleaning string logic pattern
        const cleanJson = responseText
            .replace(/```json\n?/gi, '')
            .replace(/```\n?/g, '')
            .trim();

        const structuredData = JSON.parse(cleanJson);

        return res.status(200).json({ 
            success: true, 
            data: structuredData.explanations 
        });

    } catch (error) {
        console.error("Batch Remediation Error:", error);
        res.status(500).json({ success: false, message: "Failed to compile batch remediation logs.", error: error.message });
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