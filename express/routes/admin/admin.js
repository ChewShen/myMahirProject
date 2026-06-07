const express = require('express');
const router = express.Router();
const db = require('../../config/db');

const verifyToken = require('../../middleware/auth');
const requireAdmin = require('../../middleware/requireAdmin'); 
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