const request = require('supertest')
const jwt = require('jsonwebtoken')
const app = require('../app')
const { User, Post, Comment } = require('../models')
const { sequelize } = require('../util/db')
const { SECRET } = require('../util/config')

let user, token, post

beforeAll(async () => {
  await sequelize.sync({ force: true })

  user = await User.create({
    firstname: 'Test',
    lastname: 'User',
    username: 'testuser',
    password: 'TestPassword123!',
  })

  post = await Post.create({
    post: 'Test post',
    image: null, 
    userId: user.id,
  })

  token = jwt.sign({ id: user.id, username: user.username }, SECRET)
})

afterAll(async () => {
  await sequelize.close()  
})

describe('Comments API', () => {
  test('POST /comments/:postId - should create a new comment successfully', async () => {
    const commentData = {
      content: 'This is a test comment',
    }

    const response = await request(app)
      .post(`/api/comments/${post.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(commentData)
      .expect(201)

    expect(response.body.content).toBe(commentData.content)
    expect(response.body.user.username).toBe(user.username)

    const comments = await Comment.findAll()
    expect(comments).toHaveLength(1)
  })

  test('POST /comments/:postId - should return error if the user is not found', async () => {
    const invalidToken = jwt.sign({ id: 9999, username: 'invaliduser' }, SECRET)

    const commentData = {
      content: 'This should fail',
    }

    const response = await request(app)
      .post(`/api/comments/${post.id}`)
      .set('Authorization', `Bearer ${invalidToken}`)
      .send(commentData)
      .expect(400)

    expect(response.body.error).toBe('Token puuttuu tai on virheellinen')
  })

  test('POST /comments/:postId - should return error if the post is not found', async () => {
    const nonExistentPostId = 9999

    const commentData = {
      content: 'This should fail',
    }

    const response = await request(app)
      .post(`/api/comments/${nonExistentPostId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(commentData)
      .expect(404)

    expect(response.body.error).toBe('Julkaisua ei löytynyt')
  })

  test('GET /comments/:postId - should fetch comments for a post', async () => {
    const commentData = {
      content: 'Fetching this comment',
    }

    await Comment.create({
      content: commentData.content,
      userId: user.id,
      postId: post.id,
    })

    const response = await request(app)
      .get(`/api/comments/${post.id}`)
      .expect(200)

    expect(response.body).toHaveLength(2)
    expect(response.body[1].content).toBe(commentData.content)
  })

  test('GET /comments/:postId - should return error if the post is not found', async () => {
    const nonExistentPostId = 9999

    const response = await request(app)
      .get(`/api/comments/${nonExistentPostId}`)
      .expect(404)

    expect(response.body.error).toBe('Julkaisua ei löytynyt')
  })
})
