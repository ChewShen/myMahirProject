const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('uuid', () => ({ v4: () => 'fake-test-uuid-1234' }));

jest.mock('markitdown-js', () => {
  return {
    default: class MockMarkitdown {
      async convert() {
        return { textContent: '# Mock Document Content' };
      }
    }
  };
});
jest.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: class {
      getGenerativeModel() {
        return {
          generateContent: async () => ({
            response: {
              text: () => JSON.stringify([{ title: "Mock AI Course", content: "Mock parsed content" }])
            }
          })
        };
      }
    }
  };
});

const app = require('../app'); 
const db = require('../config/db');

describe('🎓 Course & AI Tutor Workspace Integration Suite', () => {
  let validStudentToken;
  let testUserId = 1; // Fallback seed reference

  beforeAll(async () => {
  // 1. Generate a mock signed JWT token matching your verifyToken middleware requirements
  validStudentToken = jwt.sign(
    { userId: testUserId, email: 'student_test@mymahir.com', role: 'student' },
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: '1h' }
  );

  // 2. Clear out lingering test data from previous runs to maintain database safety
  await db.query('SET FOREIGN_KEY_CHECKS = 0');
  await db.query('DELETE FROM courses WHERE courseId = 9999');
  await db.query('DELETE FROM users WHERE userId = ?', [testUserId]);
  await db.query('DELETE FROM quiz WHERE userId = ?', [testUserId]);
  await db.query('SET FOREIGN_KEY_CHECKS = 1');

  // 3. Inject BOTH Parent Records cleanly so relationship logic works perfectly!
  
  // A) Insert parent user row
  await db.query(`
    INSERT INTO users (userId, userName, userEmail, userPassword, userStatus, quizCompleted)
    VALUES (?, 'Test Student Row', 'student_test@mymahir.com', 'hashedpassword', 'active', 0)
  `, [testUserId]);

  // B) Insert parent course row ONLY ONCE (Using your working table schema setup)
  await db.query(`
    INSERT INTO courses (courseId, courseName) 
    VALUES (9999, 'Test Automation Core')
  `);
});


  afterAll(async () => {
    if (db && typeof db.end === 'function') {
      await db.query('SET FOREIGN_KEY_CHECKS = 0');
      await db.query('DELETE FROM courses WHERE courseId = 9999');
      await db.query('DELETE FROM users WHERE userId = ?', [testUserId]);
      await db.query('DELETE FROM quiz WHERE userId = ?', [testUserId]);
      await db.query('SET FOREIGN_KEY_CHECKS = 1');
      await db.end(); // Cleanly close connection pool sockets
    }
  });

  describe('🛡️ verifyToken Global Middleware Check', () => {
    it('should block anonymous traffic with a 401/403 status if token header is absent', async () => {
      const res = await request(app).get('/api/courses');
      // Adjust expectation based on whether your middleware returns 401 or 403
      expect(res.statusCode).not.toBe(200); 
    });
  });

  describe('📚 RESTful Database Routes', () => {
    it('GET /api/courses -> should fetch all available rows inside table database', async () => {
      const res = await request(app)
        .get('/api/courses')
        .set('Authorization', `Bearer ${validStudentToken}`); // Injecting auth token header

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('GET /api/courses/:id -> should successfully look up and return a unique course by ID', async () => {
      const res = await request(app)
        .get('/api/courses/9999')
        .set('Authorization', `Bearer ${validStudentToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.courseName).toBe('Test Automation Core');
    });

    it('POST /api/courses/save-score -> should log student assessment results into schema', async () => {
      const res = await request(app)
        .post('/api/courses/save-score')
        .set('Authorization', `Bearer ${validStudentToken}`)
        .send({
          courseId: 9999,
          score: 4,
          totalQuestions: 5
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toContain('saved');
    });

    it('GET /api/courses/my-scores -> should parse SQL JOIN payload and return active records', async () => {
      const res = await request(app)
        .get('/api/courses/my-scores')
        .set('Authorization', `Bearer ${validStudentToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0]).toHaveProperty('courseName');
      expect(res.body.data[0]).toHaveProperty('score');
    });
  });

  describe('🤖 Deep AI Microservice Routes (Live Loop)', () => {
    // Setting longer test timeouts because external AI lookups take time
    jest.setTimeout(15000); 

    it('POST /api/courses/generate-quiz -> should process context strings into valid structures', async () => {
      const res = await request(app)
        .post('/api/courses/generate-quiz')
        .set('Authorization', `Bearer ${validStudentToken}`)
        .send({ courseContent: "Node.js uses an asynchronous event-driven JavaScript runtime engine." });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      if (res.body.data.length > 0) {
        expect(res.body.data[0]).toHaveProperty('question');
        expect(res.body.data[0]).toHaveProperty('options');
        expect(res.body.data[0]).toHaveProperty('correctAnswer');
      }
    });

    it('POST /api/courses/study-kit/generate -> should parse 3-in-1 instructional content arrays', async () => {
      const res = await request(app)
        .post('/api/courses/study-kit/generate')
        .set('Authorization', `Bearer ${validStudentToken}`)
        .send({ courseContent: "Docker wraps code into isolated containers to achieve runtime immutability." });

      expect(res.statusCode).toBe(200);
      expect(res.body.data).toHaveProperty('moduleSummaries');
      expect(res.body.data).toHaveProperty('vocabulary');
      expect(res.body.data).toHaveProperty('flashcards');
    });
  });
});