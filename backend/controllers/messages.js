const router = require('express').Router()
const { Op } = require('sequelize')
const { Message, User } = require('../models')
const tokenExtractor = require('../middlewares/tokenExtractor')

router.get('/user/:id', tokenExtractor, async (req, res) => {
  try {
    const sender = await User.findByPk(req.decodedToken.id)
    const receiver = await User.findByPk(req.params.id)

    if (!sender || !receiver) {
      return res.status(404).json({ error: 'Käyttäjää ei löydy' })
    }

    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { sender_id: sender.id, receiver_id: receiver.id },
          { sender_id: receiver.id, receiver_id: sender.id }
        ]
      },
      order: [['createdAt', 'ASC']],
      include: [{ model: User, as: 'sender' }]
    })
    res.json(messages)
  } catch (error) {
    console.error('Error handling request:', error)
    res.status(500).json({ error: 'Server Error' })
  }
})

router.get('/unread', tokenExtractor, async (req, res) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    if (!user) return res.status(400).json({ error: 'Token puuttuu tai on virheellinen' })
    
    const messages = await Message.findAll({
      where: { receiver_id: user.id, seen: false },
      include: [{ model: User, as: 'sender' }]
    })
    
    res.json(messages)
  } catch (error) {
    console.log('Error:', error.message || error)
    res.status(500).json({ error: 'Server error' })
  }
})

router.put('/seen', async (req, res) => {
  try {
    const { messageIds } = req.body
    if (!messageIds || messageIds.length === 0) {
      return res.status(400).json({ error: 'No message IDs provided' })
    }

    await Message.update({ seen: true }, { where: { id: messageIds } })
    res.status(200).json({ success: true })
  } catch (error) {
    console.log('Error marking messages as seen:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})


module.exports = router