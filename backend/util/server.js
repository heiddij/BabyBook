const WebSocket = require('websocket').server
const http = require('http')
const app = require('../app')
const { Message, User } = require('../models')

const server = http.createServer(app)
const wss = new WebSocket({ httpServer: server })

const activeConnections = new Set()

wss.on('request', (req) => {
  const connection = req.accept(null, req.origin)
  activeConnections.add(connection)

  connection.on('message', async (message) => {
    try {
      const msg = JSON.parse(message.utf8Data)
      const savedMessage = await Message.create({
        sender_id: msg.senderId,
        receiver_id: msg.receiverId,
        content: msg.content
      })

      const messageToSend = await Message.findByPk(savedMessage.id, {
        include: [{ model: User, as: 'sender' }]
      })

      activeConnections.forEach((conn) => {
        conn.sendUTF(JSON.stringify(messageToSend))
      })
    } catch (error) {
      console.error('WebSocket Error:', error)
    }
  })

  connection.on('close', (reasonCode, description) => {
    console.log(`Client disconnected: ${description} (Reason: ${reasonCode})`)
    activeConnections.delete(connection)
  })
})

module.exports = { server }