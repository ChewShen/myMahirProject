const express = require('express');
const router = express.Router();
const db = require('../../config/db');
const fs = require('fs');
const path = require('path');
const upload = require('../../middleware/upload');
const Markitdown = require('markitdown-js').default;
const { GoogleGenerativeAI } = require('@google/generative-ai');


const verifyToken = require('../../middleware/auth');
const requireAdmin = require('../../middleware/requireAdmin'); 

router.use(verifyToken);
router.use(requireAdmin);

// POST /api/admin/courses/upload — Upload and AI Generation Pipeline
router.post('/courses/upload', upload.single('document'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded." });
        }

        const filePath = req.file.path;

        // 1. Convert PDF/DOCX to Markdown
        const converter = new Markitdown();
        const conversionResult = await converter.convert(filePath);
        const rawMarkdown = conversionResult.textContent;

        // 2. Setup Gemini AI
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });

        // 3. Prompt Gemini to extract and format the content
        const prompt = `
            You are an expert curriculum developer. Analyze the following document text and extract the core educational material.
            Format it cleanly in Markdown. 
            
            - If the document is about a single coherent topic, format it as a single, well-structured course.
            - If the document is very large (e.g., a massive textbook), split it by logical chapters into a few distinct courses.
            
            You MUST return a raw JSON array (do NOT wrap it in markdown code blocks). 
            Format: [{"title": "Generated Course Title", "content": "The formatted markdown content..."}]

            Document Text:
            ${rawMarkdown}
        `;

        const result = await model.generateContent(prompt);
        let aiResponse = result.response.text();

        // 4. Clean JSON response (strip markdown fences if Gemini added them)
        aiResponse = aiResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsedCourses = JSON.parse(aiResponse);

        // 5. Cleanup: Delete the temporary file to save space
        fs.unlinkSync(filePath);

        // Return the parsed courses to the frontend for REVIEW (Not saving to DB yet)
        res.status(200).json({ success: true, data: parsedCourses });

    } catch (error) {
        console.error("Upload/Processing Error:", error);
        // Ensure file is deleted even if an error occurs
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ success: false, message: "Failed to process document." });
    }
});


// POST /api/admin/courses/bulk — Save the approved courses
router.post('/courses/bulk', async (req, res) => {
    try {
        const { courses } = req.body; // Expects an array of {title, content}
        const authorId = req.user.userId;

        if (!courses || !Array.isArray(courses)) {
             return res.status(400).json({ success: false, message: "Invalid payload." });
        }

        // Insert all approved courses into the database
        for (const course of courses) {
             await db.query(
                'INSERT INTO courses (courseName, courseStatus, courseContent, authorId) VALUES (?, "open", ?, ?)', 
                [course.title, course.content, authorId]
            );
        }

        res.status(201).json({ success: true, message: "Courses saved successfully!" });
    } catch (error) {
        console.error("Bulk Save Error:", error);
        res.status(500).json({ success: false, message: "Failed to save courses." });
    }
});

// ROUTE 2: Get all student scores for the dashboard
router.get('/scores', async (req, res) => {
    try {
        // A SQL JOIN to get the student's name, the course title, and their score!
        const query = `
            SELECT users.userName, courses.courseName, quiz.score, quiz.totalQuestions 
            FROM quiz
            JOIN users ON quiz.userId = users.userId
            JOIN courses ON quiz.courseId = courses.courseId
            ORDER BY quiz.quizId DESC
        `;
        const [results] = await db.query(query);
        res.status(200).json({ success: true, data: results });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to fetch scores." });
    }
});

// ROUTE 3: See a list of all registered students
router.get('/students', async (req, res) => {
    // Logic to SELECT * FROM users WHERE role = 'student'
});

router.post('/courses', async (req, res) => {
    try {
        // 1. Extract exactly what Angular sends! (title, description, content)
        const { title, content } = req.body;
        const authorId = req.user.userId;
        
        // 2. Map 'title' to your 'courseName' column, and add the description!
        const [result] = await db.query(
            'INSERT INTO courses (courseName, courseStatus, courseContent, authorId) VALUES (?, "open", ?, ?)', 
            [title, content, authorId] // Order must match the ? marks!
        );

        res.status(201).json({ success: true, message: "Course published successfully!" });
    } catch (err) {
        console.error("Course Creation Error:", err);
        res.status(500).json({ success: false, message: "Failed to publish course.", exactError: err.message });
    }
});

// DELETE /api/admin/courses/:id
router.delete('/courses/:id', verifyToken, requireAdmin, async (req, res) => {
    try {
        const courseId = req.params.id;

        // 1. Delete associated quizzes first to prevent Foreign Key errors
        await db.query('DELETE FROM quiz WHERE courseId = ?', [courseId]);

        // 2. Delete the course itself
        const [result] = await db.query('DELETE FROM courses WHERE courseId = ?', [courseId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Course not found." });
        }

        res.status(200).json({ success: true, message: "Course securely deleted." });
    } catch (error) {
        console.error("Delete Error:", error);
        res.status(500).json({ success: false, message: "Failed to delete course." });
    }
});

// PUT /api/admin/courses/:id
router.put('/courses/:id', verifyToken, requireAdmin, async (req, res) => {
    try {
        const { title, content } = req.body;
        const courseId = req.params.id;
        
        await db.query(
            'UPDATE courses SET courseName = ?, courseContent = ? WHERE courseId = ?', 
            [title, content, courseId]
        );

        res.status(200).json({ success: true, message: "Course updated successfully!" });
    } catch (err) {
        console.error("Update Error:", err);
        res.status(500).json({ success: false, message: "Failed to update course." });
    }
});

module.exports = router;