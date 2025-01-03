const express = require('express')
const router = express.Router()
const { Follow, User, Baby } = require('../models')
const tokenExtractor = require('../middlewares/tokenExtractor')

router.post('/:id', tokenExtractor, async (req, res) => {
  const followerId = req.decodedToken.id
  const followingId = req.params.id

  if (followerId === followingId) {
    return res.status(400).json({ error: 'Käyttäjä ei voi seurata itseään.' })
  }

  try {
    const follower = await User.findByPk(followerId, {
      include: [
        { model: Baby },
        { model: User, as: 'followers' },
        { model: User, as: 'following' }
      ]
    })
    const following = await User.findByPk(followingId, {
      include: [
        { model: Baby },
        { model: User, as: 'followers' },
        { model: User, as: 'following' }
      ]
    })

    if (!follower || !following) {
      return res.status(404).json({ error: 'Käyttäjää ei löydy.' })
    }

    const existingFollow = await Follow.findOne({ where: { followerId, followingId } })
    if (existingFollow) {
      return res.status(400).json({ error: 'Tämä käyttäjä on jo seurattuna.' })
    }

    await Follow.create({ followerId, followingId })

    res.status(200).json({ follower, following })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Server error.' })
  }
})

router.delete('/:id', tokenExtractor, async (req, res) => {
  const followerId = req.decodedToken.id
  const followingId = req.params.id

  if (followerId === followingId) {
    return res.status(400).json({ error: 'Käyttäjä ei voi seurata itseään.' })
  }

  const existingFollow = await Follow.findOne({ where: { followerId, followingId } })

  existingFollow  && existingFollow.destroy()
  res.status(204).end()
})

module.exports = router