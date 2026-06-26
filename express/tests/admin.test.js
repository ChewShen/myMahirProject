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

describe('Admin Dashboard & CRUD Operations Integration Suite', () => {
  let validAdminToken;
  let invalidStudentToken;
  const adminId = 7777;
  const studentId = 6666;
  const targetCourseId = 5555;

  beforeAll(async () => {
    // 1. Generate an authoritative signed Admin token
    validAdminToken = jwt.sign(
      { userId: adminId, email: 'admin@mymahir.com', role: 'admin' },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '1h' }
    );

    // 2. Generate an unauthorized student token
    invalidStudentToken = jwt.sign(
      { userId: studentId, email: 'student@mymahir.com', role: 'student' },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '1h' }
    );

    // 3. Setup predictable environment rows inside container
    await db.query('SET FOREIGN_KEY_CHECKS = 0');
    await db.query('DELETE FROM courses WHERE courseId = ?', [targetCourseId]);
    await db.query('DELETE FROM users WHERE userId IN (?, ?)', [adminId, studentId]);
    await db.query('DELETE FROM quiz WHERE courseId = ?', [targetCourseId]);

    // Insert mock admin account reference
    await db.query(`
      INSERT INTO users (userId, userName, userEmail, userPassword, userRole, userStatus, quizCompleted)
      VALUES (?, 'System Administrator', 'admin@mymahir.com', 'hashed', 'admin', 'active', 0)
    `, [adminId]);
    await db.query('SET FOREIGN_KEY_CHECKS = 1');
  });

  afterAll(async () => {
    if (db && typeof db.end === 'function') {
      await db.query('SET FOREIGN_KEY_CHECKS = 0');
      await db.query('DELETE FROM courses WHERE courseId = ? OR courseId = 9999', [targetCourseId]);
      await db.query('DELETE FROM users WHERE userId IN (?, ?)', [adminId, studentId]);
      await db.query('DELETE FROM quiz WHERE courseId = ?', [targetCourseId]);
      await db.query('SET FOREIGN_KEY_CHECKS = 1');
      await db.end();
    }
  });

  describe('Endpoint Authorization Layer Enforcement', () => {
    it('GET /api/admin/scores -> should reject requests if authorization token header is absent', async () => {
      const res = await request(app).get('/api/admin/scores');
      expect(res.statusCode).toBe(403); // 🚨 This test might FAIL right now!
    });

    it('POST /api/admin/courses -> should block student access profiles with 403 Forbidden', async () => {
      const res = await request(app)
        .post('/api/admin/courses')
        .set('Authorization', `Bearer ${invalidStudentToken}`)
        .send({ title: 'Hacking 101', content: 'Malicious input payload' });

      expect(res.statusCode).toBe(403);
    });
  });

  describe('Course Creation & Lifecycle (Admin Verified)', () => {
    it('POST /api/admin/courses -> should allow admin to publish a new active course option', async () => {
      // Temporarily use another ID or let your endpoint execute since it reads req.user.userId
      const res = await request(app)
        .post('/api/admin/courses')
        .set('Authorization', `Bearer ${validAdminToken}`)
        .send({
          title: 'Docker Orchestration Suite',
          content: 'Building production cluster environments with compose patterns.'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('published');
    });
  });

  describe('Cascade Deletions and Content Mutations', () => {
    beforeEach(async () => {
      // Seed targetCourseId right before mutating routes run
      await db.query('SET FOREIGN_KEY_CHECKS = 0');
      await db.query('DELETE FROM courses WHERE courseId = ?', [targetCourseId]);
      await db.query(`
        INSERT INTO courses (courseId, courseName, courseContent, authorId)
        VALUES (?, 'Mutable Course Template', 'Original study texts', ?)
      `, [targetCourseId, adminId]);
      await db.query('SET FOREIGN_KEY_CHECKS = 1');
    });

    it('PUT /api/admin/courses/:id -> should successfully commit content column updates', async () => {
      const res = await request(app)
        .put(`/api/admin/courses/${targetCourseId}`)
        .set('Authorization', `Bearer ${validAdminToken}`)
        .send({
          title: 'Updated Template Course Name',
          content: 'Newly rewritten instructional material.'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('DELETE /api/admin/courses/:id -> should execute cascading row deletion safely', async () => {
      const res = await request(app)
        .delete(`/api/admin/courses/${targetCourseId}`)
        .set('Authorization', `Bearer ${validAdminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toContain('deleted');
    });
  });

  describe('Automated Curriculum Parsing (V3 Feature)', () => {
    
    it('POST /api/admin/courses/upload -> should parse document and return AI structured courses', async () => {
      // Create a fake file in memory
      const mockFileBuffer = Buffer.from('dummy pdf content');
      
      const res = await request(app)
        .post('/api/admin/courses/upload')
        .set('Authorization', `Bearer ${validAdminToken}`)
        // Supertest allows us to simulate a file upload using .attach()
        .attach('document', mockFileBuffer, 'syllabus.pdf'); 

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      // Verify that our Mocked AI response was successfully passed down to the client
      expect(res.body.data[0].title).toBe('Mock AI Course'); 
    });

    it('POST /api/admin/courses/bulk -> should successfully bulk insert approved courses', async () => {
      const payload = {
        courses: [
          { title: "AI Generated Module 1", content: "Markdown content 1" },
          { title: "AI Generated Module 2", content: "Markdown content 2" }
        ]
      };

      const res = await request(app)
        .post('/api/admin/courses/bulk')
        .set('Authorization', `Bearer ${validAdminToken}`)
        .send(payload);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('saved successfully');

      // 3. DATABASE VERIFICATION: Ensure the courses were actually written to MySQL
      const [rows] = await db.query('SELECT * FROM courses WHERE courseName LIKE "AI Generated Module%"');
      expect(rows.length).toBe(2);
      
      // Cleanup the test data
      await db.query('DELETE FROM courses WHERE courseName LIKE "AI Generated Module%"');
    });
    
    it('POST /api/admin/courses/upload -> should reject requests with no file attached', async () => {
      const res = await request(app)
        .post('/api/admin/courses/upload')
        .set('Authorization', `Bearer ${validAdminToken}`);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('No file uploaded');
    });
  });
});

