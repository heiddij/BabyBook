const request = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const { User } = require('../models')
const { sequelize } = require('../util/db')

describe('Login API', () => {
  let user

  beforeAll(async () => {
    await sequelize.sync({ force: true })

    const passwordHash = await bcrypt.hash('TestPassword123!', 10)
    user = await User.create({
      firstname: 'Test',
      lastname: 'User',
      username: 'testuser',
      passwordHash,
    })
  })

  afterAll(async () => {
    await sequelize.close()
  })

  test('POST /api/login succeeds with correct credentials', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({
        username: 'testuser',
        password: 'TestPassword123!',
      })

    expect(response.status).toBe(200)
    expect(response.body.token).toBeDefined()
    expect(response.body.username).toBe(user.username)
    expect(response.body.id).toBe(user.id)
  })

  test('POST /api/login fails with incorrect password', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({
        username: 'testuser',
        password: 'WrongPassword123!',
      })

    expect(response.status).toBe(401)
    expect(response.body.error).toBe('Väärä käyttäjänimi tai salasana')
  })

  test('POST /api/login fails with non-existent username', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({
        username: 'nonexistentuser',
        password: 'TestPassword123!',
      })

    expect(response.status).toBe(401)
    expect(response.body.error).toBe('Väärä käyttäjänimi tai salasana')
  })
})