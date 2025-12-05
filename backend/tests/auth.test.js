const request = require('supertest');
const app = require('../app');
const { User, sequelize } = require('../models/User'); // Kullanıcı ve DB erişimi

describe('Auth API', () => {
  // ✅ Her testten önce aynı kullanıcıyı sil
  beforeEach(async () => {
    await User.destroy({ where: { username: 'testuser' } });
  });

  // ✅ Testten sonra DB bağlantısını kapat
  afterAll(async () => {
    await sequelize.close();
  });

  it('should return 422 if username or password is missing', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ password: '12345678' });

    expect(res.statusCode).toBe(422); // veya 400, senin kontrolüne göre
    expect(res.body.message).toMatch(/required/i);
  });

  it('should return 201 when registration is successful', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        password: '12345678',
        email: 'test@example.com',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toMatch(/registered/i);
  });
});
