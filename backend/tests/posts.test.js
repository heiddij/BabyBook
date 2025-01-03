const request = require('supertest')
const jwt = require('jsonwebtoken')
const app = require('../app')
const { User, Baby, Post } = require('../models')
const { sequelize } = require('../util/db')
const { SECRET } = require('../util/config')

let user, token, baby

beforeAll(async () => {
  await sequelize.sync({ force: true })

  user = await User.create({
    firstname: 'Test',
    lastname: 'User',
    username: 'testuser',
    password: 'TestPassword123!',
  })

  token = jwt.sign({ id: user.id, username: user.username }, SECRET)

  baby = await Baby.create({
    firstname: 'Baby',
    lastname: 'User',
    birthdate: '2023-01-01',
    birthplace: 'City A',
    userId: user.id,
  })

  await Post.create({
    post: 'First post',
    image: null,
    babyId: baby.id,
  })
})

afterAll(async () => {
  await sequelize.close()
})

describe('POSTS API', () => {
  test('GET /api/posts - Fetch all posts', async () => {
    const response = await request(app).get('/api/posts').expect(200)
    expect(response.body).toHaveLength(1)
    expect(response.body[0].post).toBe('First post')
  })

  test('GET /api/posts/own - Fetch user’s own posts', async () => {
    const response = await request(app)
      .get('/api/posts/own')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

    expect(response.body).toHaveLength(1)
    expect(response.body[0].post).toBe('First post')
  })

  test('GET /api/posts/following - Fetch posts of followed users', async () => {
    const anotherUser = await User.create({
      firstname: 'Another',
      lastname: 'User',
      username: 'anotheruser',
      password: 'TestPassword123!',
    })

    const anotherBaby = await Baby.create({
      firstname: 'AnotherBaby',
      lastname: 'User',
      birthdate: '2023-01-01',
      birthplace: 'City B',
      userId: anotherUser.id,
    })

    await Post.create({
      post: 'Another post',
      image: null,
      babyId: anotherBaby.id,
    })

    await user.addFollowing(anotherUser)

    const response = await request(app)
      .get('/api/posts/following')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

    expect(response.body).toHaveLength(1)
    expect(response.body[0].post).toBe('Another post')
  })

  test('POST /api/posts/:id - Create a new post for a baby', async () => {
    const response = await request(app)
      .post(`/api/posts/${baby.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ post: 'A new post' })
      .expect(200)

    expect(response.body.post).toBe('A new post')

    const posts = await Post.findAll()
    expect(posts).toHaveLength(3)
  })
})
