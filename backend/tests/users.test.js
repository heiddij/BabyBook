const request = require('supertest')
const app = require('../app')
const { sequelize } = require('../util/db')
const { User } = require('../models')

beforeAll(async () => {
  await sequelize.authenticate()
  await sequelize.sync({ force: true })
})

afterAll(async () => {
  await sequelize.close()
})

describe('User API', () => {
  test('GET /api/users - should fetch all users', async () => {
    await User.create({
      firstname: 'Test',
      lastname: 'User',
      username: 'testuser',
      password: 'TestPassword123!'
     })
    await User.create({
      firstname: 'Test2',
      lastname: 'User2',
      username: 'testuser2',
      password: 'TestPassword123!'
     })

    const response = await request(app).get('/api/users')

    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
    expect(response.body.length).toBe(2)
    expect(response.body[0].username).toBe('testuser')
    expect(response.body[1].username).toBe('testuser2')
  })

  test('GET /api/users/:id - should fetch a single user', async () => {
    const user = await User.create({
      firstname: 'Test3',
      lastname: 'User3',
      username: 'testuser3',
      password: 'TestPassword123!'
     })

    const response = await request(app).get(`/api/users/${user.id}`)

    expect(response.status).toBe(200)
    expect(response.body.username).toBe('testuser3')
    expect(response.body.firstname).toBe('Test3')
  })

  test('POST /api/users - should create a new user', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({
        firstname: 'Test4',
        lastname: 'User4',
        username: 'testuser4',
        password: 'TestPassword123!'
       })

    expect(response.status).toBe(200)
    expect(response.body).toBe('testuser4')
  })

  test('POST /api/users - should return 400 when username already exists', async () => {
    await User.create({
      firstname: 'Test5',
      lastname: 'User5',
      username: 'testuser5',
      password: 'TestPassword123!'
     })

    const response = await request(app)
      .post('/api/users')
      .send({
        firstname: 'Test6',
        lastname: 'User6',
        username: 'testuser5',
        password: 'TestPassword123!'
       })

    expect(response.status).toBe(400)
    expect(response.body.error).toBe('Käyttäjänimi on jo varattu')
  })
})
