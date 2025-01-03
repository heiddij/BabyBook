const request = require('supertest')
const app = require('../app')
const { sequelize } = require('../util/db')
const { User, Follow } = require('../models')
const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')

describe('Follow API', () => {
  let user1, user2, user1Token, user2Token

  beforeAll(async () => {
    await sequelize.sync({ force: true })

    user1 = await User.create({
      firstname: 'User1',
      lastname: 'Test',
      username: 'user1',
      password: 'TestPassword123!',
    })

    user2 = await User.create({
      firstname: 'User2',
      lastname: 'Test',
      username: 'user2',
      password: 'TestPassword123!',
    })

    user1Token = jwt.sign({ id: user1.id, username: user1.username }, SECRET)
    user2Token = jwt.sign({ id: user2.id, username: user2.username }, SECRET)
  })

  afterAll(async () => {
    await sequelize.close()
  })

  describe('POST /api/follow/:id', () => {
    test('successfully follows another user', async () => {
      const response = await request(app)
        .post(`/api/follow/${user2.id}`)
        .set('Authorization', `Bearer ${user1Token}`)
        .send()

      expect(response.status).toBe(200)
      expect(response.body.follower.id).toBe(user1.id)
      expect(response.body.following.id).toBe(user2.id)

      const follow = await Follow.findOne({
        where: { followerId: user1.id, followingId: user2.id },
      })
      expect(follow).not.toBeNull()
    })

    test('fails to follow the same user twice', async () => {
      const response = await request(app)
        .post(`/api/follow/${user2.id}`)
        .set('Authorization', `Bearer ${user1Token}`)
        .send()

      expect(response.status).toBe(400)
      expect(response.body.error).toBe('Tämä käyttäjä on jo seurattuna.')
    })

    test('fails to follow oneself', async () => {
      const response = await request(app)
        .post(`/api/follow/${user1.id}`)
        .set('Authorization', `Bearer ${user1Token}`)
        .send()

      expect(response.status).toBe(400)
      expect(response.body.error).toBe('Käyttäjä ei voi seurata itseään.')
    })
  })

  describe('DELETE /api/follow/:id', () => {
    test('successfully unfollows a user', async () => {
      const response = await request(app)
        .delete(`/api/follow/${user2.id}`)
        .set('Authorization', `Bearer ${user1Token}`)
        .send()

      expect(response.status).toBe(204)

      const follow = await Follow.findOne({
        where: { followerId: user1.id, followingId: user2.id },
      })
      expect(follow).toBeNull()
    })

    test('fails to unfollow a user that is not being followed', async () => {
      const response = await request(app)
        .delete(`/api/follow/${user2.id}`)
        .set('Authorization', `Bearer ${user1Token}`)
        .send()

      expect(response.status).toBe(204)
    })

    test('fails to unfollow oneself', async () => {
      const response = await request(app)
        .delete(`/api/follow/${user1.id}`)
        .set('Authorization', `Bearer ${user1Token}`)
        .send()

      expect(response.status).toBe(400)
      expect(response.body.error).toBe('Käyttäjä ei voi seurata itseään.')
    })
  })
})