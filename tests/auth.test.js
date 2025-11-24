const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');

let mongod;
let app;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  process.env.MONGO_URI = uri;
  process.env.JWT_SECRET = 'test-secret';

  // require app after setting env (server will call connectDB)
  app = require('../server');

  // wait for mongoose connection to open
  await new Promise((resolve, reject) => {
    mongoose.connection.once('open', resolve);
    mongoose.connection.once('error', reject);
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongod) await mongod.stop();
});

beforeEach(async () => {
  // clear db
  const collections = await mongoose.connection.db.collections();
  for (const c of collections) {
    await c.deleteMany({});
  }
});

describe('Auth flows', () => {
  test('register -> login -> me -> logout', async () => {
    const registerPayload = {
      empresa: { cpf_cnpj: '00011122233', nome: 'Test Co', tipo: 'CNPJ' },
      user: { nome: 'Tester', email: 'tester@example.com', senha: 'pass123' }
    };

    // Register
    const regRes = await request(app).post('/api/auth/register').send(registerPayload).expect(201);
    expect(regRes.body).toHaveProperty('token');
    expect(regRes.body).toHaveProperty('user');
    const token = regRes.body.token;

    // Access protected me
    const meRes = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`).expect(200);
    expect(meRes.body).toHaveProperty('user');
    expect(meRes.body.user.email).toBe('tester@example.com');

    // Logout
    const outRes = await request(app).post('/api/auth/logout').set('Authorization', `Bearer ${token}`).expect(200);
    expect(outRes.body).toEqual({ ok: true });

    // After logout, token should be invalid
    await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`).expect(401);

    // Login again
    const loginRes = await request(app).post('/api/auth/login').send({ email: 'tester@example.com', senha: 'pass123' }).expect(200);
    expect(loginRes.body).toHaveProperty('token');
    expect(loginRes.body).toHaveProperty('user');

  });
});
