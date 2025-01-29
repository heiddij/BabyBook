const router = require('express').Router()
const { Comment, Post, User } = require('../models')
const tokenExtractor = require('../middlewares/tokenExtractor')

router.post('/:postId', tokenExtractor, async (req, res) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const post = await Post.findByPk(req.params.postId)

    if (!user) {
      return res.status(400).json({ error: 'Token puuttuu tai on virheellinen' })
    }

    if (!post) {
      return res.status(404).json({ error: 'Julkaisua ei löytynyt' })
    }

    const createdComment = await Comment.create({
      content: req.body.content,
      userId: user.id,
      postId: post.id,
    })

    const comment = await Comment.findByPk(createdComment.id, { include: User })

    res.status(201).json(comment)
  } catch (error) {
    console.error('Error:', error.message || error)
    res.status(500).json({ error: 'Server error' })
  }
})

router.get('/:postId', async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.postId, {
      include: [{ model: Comment, include: User }]
    })

    if (!post) {
      return res.status(404).json({ error: 'Julkaisua ei löytynyt' })
    }

    res.json(post.comments)
  } catch (error) {
    console.error('Error:', error.message || error)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
