const request = require('supertest')
const app = require('../app')
const { sequelize } = require('../util/db')
const { Baby, User } = require('../models')
const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')

let token

beforeAll(async () => {
  await sequelize.sync({ force: true })

  const user = await User.create({
    firstname: 'Test',
    lastname: 'User',
    username: 'testuser',
    password: 'Password1!'
  })

  token = jwt.sign({ id: user.id }, SECRET)
})

afterAll(async () => {
  await sequelize.close()
})

describe('Babies API', () => {
  test('GET /api/babies returns all babies', async () => {
    await Baby.create({
      firstname: 'Baby',
      lastname: 'One',
      birthdate: '2020-01-01',
      birthplace: 'City A'
    })

    const response = await request(app).get('/api/babies')
    expect(response.status).toBe(200)
    expect(response.body.length).toBe(1)
    expect(response.body[0].firstname).toBe('Baby')
  })

  test('POST /api/babies creates a new baby', async () => {
    const response = await request(app)
      .post('/api/babies')
      .set('Authorization', `Bearer ${token}`)
      .field('firstname', 'Baby')
      .field('lastname', 'Two')
      .field('birthdate', '2021-02-02')
      .field('birthplace', 'City B')

    expect(response.status).toBe(200)
    expect(response.body.firstname).toBe('Baby')
    expect(response.body.lastname).toBe('Two')
  })

  test('GET /api/babies/:id returns a single baby', async () => {
    const baby = await Baby.create({
      firstname: 'Baby',
      lastname: 'Three',
      birthdate: '2022-03-03',
      birthplace: 'City C'
    })

    const response = await request(app).get(`/api/babies/${baby.id}`)
    expect(response.status).toBe(200)
    expect(response.body.firstname).toBe('Baby')
    expect(response.body.lastname).toBe('Three')
  })

  test('PUT /api/babies/:id updates a baby', async () => {
    const baby = await Baby.create({
      firstname: 'Baby',
      lastname: 'Four',
      birthdate: '2023-04-04',
      birthplace: 'City D',
      userId: 1
    })

    const response = await request(app)
      .put(`/api/babies/${baby.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        firstname: 'Updated',
        lastname: 'Baby',
        birthdate: '2023-05-05',
        birthplace: 'Updated City'
      })

    expect(response.status).toBe(200)
    expect(response.body.firstname).toBe('Updated')
    expect(response.body.lastname).toBe('Baby')
    expect(response.body.birthplace).toBe('Updated City')
  })

  test('DELETE /api/babies/:id deletes a baby', async () => {
    const baby = await Baby.create({
      firstname: 'Baby',
      lastname: 'Five',
      birthdate: '2024-05-05',
      birthplace: 'City E',
      userId: 1
    })
  
    const response = await request(app)
      .delete(`/api/babies/${baby.id}`)
      .set('Authorization', `Bearer ${token}`)
  
    expect(response.status).toBe(204)
  
    const deletedBaby = await Baby.findByPk(baby.id)
    expect(deletedBaby).toBeNull()
  })
})