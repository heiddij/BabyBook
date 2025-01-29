const { Post, User, Like } = require('../models')

const likePost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id)
    const user = await User.findByPk(req.decodedToken.id)
  
    if (!user) return res.status(400).json({ error: 'Token puuttuu tai on virheellinen' })
    if (!post) return res.status(404).json({ error: 'Julkaisua ei löydy' })

    const existingLike = await Like.findOne({ where: { postId: post.id, userId: user.id } })
    if (existingLike) return res.status(400).json({ error: 'Julkaisusta on jo tykätty' })

    await Like.create({ userId: user.id, postId: post.id })

    const updatedPost = await Post.findByPk(req.params.id, {
      include: [{ model: User, as: 'likers' }]
    })

    res.status(200).json(updatedPost)
  } catch (error) {
    console.error('Error:', error.message || error)
    res.status(500).json({ error: 'Server error' })
  }
}

const unlikePost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id)
    const user = await User.findByPk(req.decodedToken.id)
  
    if (!user) return res.status(400).json({ error: 'Token puuttuu tai on virheellinen' })
    if (!post) return res.status(404).json({ error: 'Julkaisua ei löydy' })

    await Like.destroy({ where: { userId: user.id, postId: post.id } })

    const updatedPost = await Post.findByPk(req.params.id, {
      include: [{ model: User, as: 'likers' }]
    })

    res.json(updatedPost)
  } catch (error) {
    console.error('Error:', error.message || error)
    res.status(500).json({ error: 'Server error' })
  }
}

module.exports = { likePost, unlikePost }