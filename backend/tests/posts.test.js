const request = require('supertest')
const jwt = require('jsonwebtoken')
const app = require('../app')
const { User, Baby, Post } = require('../models')
const { sequelize } = require('../util/db')
const { SECRET } = require('../util/config')

let user, token, baby, post

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

  post = await Post.create({
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

  test('GET /api/posts/userId - Fetch user\'s own posts', async () => {
    const response = await request(app)
      .get(`/api/posts/${user.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

    expect(response.body).toHaveLength(1)
    expect(response.body[0].post).toBe('First post')
  })

  test('GET /api/posts/user/following - Fetch posts of followed users', async () => {
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
      .get('/api/posts/user/following')
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

  describe('LIKE/UNLIKE functionality', () => {
    test('POST /posts/:id/like - should like a post successfully', async () => {
      const response = await request(app)
        .post(`/api/posts/${post.id}/like`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)

      expect(response.body.likers).toHaveLength(1)
      expect(response.body.likers[0].username).toBe(user.username)
    })

    test('POST /posts/:id/like - should return error if the user is not found', async () => {
      const invalidToken = jwt.sign({ id: 9999, username: 'invaliduser' }, SECRET)

      const response = await request(app)
        .post(`/api/posts/${post.id}/like`)
        .set('Authorization', `Bearer ${invalidToken}`)
        .expect(400)

      expect(response.body.error).toBe('Token puuttuu tai on virheellinen')
    })

    test('POST /posts/:id/like - should return error if the post is not found', async () => {
      const nonExistentPostId = 9999

      const response = await request(app)
        .post(`/api/posts/${nonExistentPostId}/like`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404)

      expect(response.body.error).toBe('Julkaisua ei löydy')
    })

    test('POST /posts/:id/like - should return error if the post is already liked', async () => {
      await request(app)
        .post(`/api/posts/${post.id}/like`)
        .set('Authorization', `Bearer ${token}`)

      const response = await request(app)
        .post(`/api/posts/${post.id}/like`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)

      expect(response.body.error).toBe('Julkaisusta on jo tykätty')
    })

    test('DELETE /posts/:id/unlike - should unlike a post successfully', async () => {
      await request(app)
        .post(`/api/posts/${post.id}/like`)
        .set('Authorization', `Bearer ${token}`)

      const response = await request(app)
        .delete(`/api/posts/${post.id}/unlike`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)

      expect(response.body.likers).toHaveLength(0)
    })

    test('DELETE /posts/:id/unlike - should return error if the user is not found while unliking', async () => {
      const invalidToken = jwt.sign({ id: 9999, username: 'invaliduser' }, SECRET)

      const response = await request(app)
        .delete(`/api/posts/${post.id}/unlike`)
        .set('Authorization', `Bearer ${invalidToken}`)
        .expect(400)

      expect(response.body.error).toBe('Token puuttuu tai on virheellinen')
    })

    test('DELETE /posts/:id/unlike - should return error if the post is not found while unliking', async () => {
      const nonExistentPostId = 9999

      const response = await request(app)
        .delete(`/api/posts/${nonExistentPostId}/unlike`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404)

      expect(response.body.error).toBe('Julkaisua ei löydy')
    })
  })
})
