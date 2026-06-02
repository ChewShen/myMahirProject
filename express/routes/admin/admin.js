const express = require('express');
const router = express.Router();
const db = require('../../config/db');

// ROUTE 1: Create a new Course
router.post('/courses', async (req, res) => {
    // Logic to insert a new course into the database
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

module.exports = router;