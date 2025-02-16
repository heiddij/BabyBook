const WebSocket = require('websocket').server
const http = require('http')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')
const { Message, User } = require('../models')
const { SECRET, WEBSOCKET_PORT } = require('./config')

const createServer = () => {
  const httpServer = http.createServer(async (req, res) => {
    cors()(req, res, async () => {
      try {
        const match = req.url.match(/^\/messages\/(\d+)$/)
        if (!match) {
          res.writeHead(400, { 'Content-Type': 'application/json' })
          return res.end(JSON.stringify({ error: 'Invalid URL format' }))
        }
        const receiverId = match[1]

        const authorization = req.headers.authorization
        if (!authorization || !authorization.toLowerCase().startsWith('bearer ')) {
          res.writeHead(401, { 'Content-Type': 'application/json' })
          return res.end(JSON.stringify({ error: 'Token puuttuu tai on väärä' }))
        }

        const decodedToken = jwt.verify(authorization.substring(7), SECRET)
        if (!decodedToken.id) {
          res.writeHead(401, { 'Content-Type': 'application/json' })
          return res.end(JSON.stringify({ error: 'Väärä token' }))
        }

        const sender = await User.findByPk(decodedToken.id)
        const receiver = await User.findByPk(receiverId)

        if (!sender || !receiver) {
          res.writeHead(404, { 'Content-Type': 'application/json' })
          return res.end(JSON.stringify({ error: 'Käyttäjää ei löydy' }))
        }

        const messages = await fetchMessages(sender, receiver)

        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(messages))
      } catch (error) {
        console.error('Error handling request:', error)
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Server Error' }))
      }
    })
  })


  const webSocketServer = new WebSocket({ httpServer })

  const activeConnections = new Set()

  webSocketServer.on('request', (req) => {
    const connection = req.accept(null, req.origin)

    activeConnections.add(connection)

    connection.on('message', async (message) => {
      const msg = JSON.parse(message.utf8Data)
      const savedMessage = await Message.create({
        sender_id: msg.senderId,
        receiver_id: msg.receiverId,
        content: msg.content
      })
      const messageToSend = await Message.findByPk(savedMessage.id, {
        include: [
          { model: User, as: 'sender' }
        ]}
      )

      activeConnections.forEach(conn => {
        conn.sendUTF(JSON.stringify(messageToSend))
      })
    })

    connection.on('close', (reasonCode, description) => {
      console.log(`Client disconnected: ${description} (Reason: ${reasonCode})`)
      activeConnections.delete(connection)
    })
  })

  httpServer.listen(WEBSOCKET_PORT, () => console.log(`WebSocket server running on port ${WEBSOCKET_PORT}`))
}

const fetchMessages = async (user1, user2) => {
  const messages = await Message.findAll({
    where: {
      [Op.or]: [
        { sender_id: user1.id, receiver_id: user2.id },
        { sender_id: user2.id, receiver_id: user1.id }
      ]
    },
    order: [['createdAt', 'ASC']],
    include: [
      { model: User, as: 'sender' }
    ]
  })
  return messages
}

module.exports = { createServer }