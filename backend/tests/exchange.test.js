const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models/User');

describe('Exchange API', () => {
  // ✅ Testten sonra DB bağlantısını kapat
  afterAll(async () => {
    await sequelize.close();
  });

  it('should return exchange rates successfully', async () => {
    const res = await request(app).get('/api/exchange');

    // Bu endpoint auth gerektiriyorsa önce auth'u kapatman gerekebilir
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('rates');
    expect(res.body.rates).toHaveProperty('USD');
    expect(res.body.rates).toHaveProperty('EUR');
  });
});
