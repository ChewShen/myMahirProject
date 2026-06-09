const request = require('supertest');
const app = require('../app');
const db = require('../config/db');

describe('🔐 Authentication Flow Integration Testing', () => {
  // Generate a uniquely identifier per test run so it never duplicates fields
  const uniqueId = Date.now();
  const testUser = {
    name: "Shen Test",
    email: `test_${uniqueId}@mymahir.com`,
    password: "SecurePassword123!"
  };

  // Clean up database connection socket pool when tests are complete
  afterAll(async () => {
  if (db && typeof db.end === 'function') {
    try {
      // 1. Tell MySQL to turn off foreign key validation loops temporarily
      await db.query('SET FOREIGN_KEY_CHECKS = 0');
      
      // 2. Clear out your test accounts cleanly
      await db.query('DELETE FROM users WHERE userEmail LIKE "test_%"');
      
      // 3. Turn safety rules back on immediately!
      await db.query('SET FOREIGN_KEY_CHECKS = 1');
    } catch (err) {
      console.error("Cleanup Error ignored:", err);
    } finally {
      // 4. Always close the engine socket pool cleanly
      await db.end();
    }
  }
});

  describe('📦 POST /api/register', () => {
    it('should successfully register a brand new active student account', async () => {
      const res = await request(app)
        .post('/api/register') // Make sure this matches your app.js mounting path!
        .send(testUser);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('successfully');
    });

    it('should return 400 Bad Request when attempting to register a duplicate email', async () => {
      // Send the exact same payload again to trigger your catch block constraint
      const res = await request(app)
        .post('/api/register')
        .send(testUser);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('already in use');
    });
  });

  describe('🔑 POST /api/login', () => {
    it('should successfully authenticate user and return a signed JSON Web Token (JWT)', async () => {
      const res = await request(app)
        .post('/api/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('token'); // Verifies JWT generation
      expect(res.body.user.email).toBe(testUser.email);
    });

    it('should drop request with 400 Bad Request if fields are blank (Upstream Guard Trigger)', async () => {
      const res = await request(app)
        .post('/api/login')
        .send({ email: '', password: '' });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 401 Unauthorized for incorrect passwords', async () => {
      const res = await request(app)
        .post('/api/login')
        .send({
          email: testUser.email,
          password: 'completely_wrong_password'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('🛠️ POST /api/setup-admin', () => {
    it('should reject provisioning if the devKey parameter is missing or wrong', async () => {
      const res = await request(app)
        .post('/api/setup-admin')
        .send({
          email: `admin_${uniqueId}@mymahir.com`,
          password: "AdminPassword!",
          name: "System Admin",
          devKey: "WRONG_SECRET_KEY"
        });

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toContain('Unauthorized');
    });
  });
});