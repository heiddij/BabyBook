require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path')
const sanitization = require('./middlewares/sanitization')

const usersRouter = require('./controllers/users')
const babiesRouter = require('./controllers/babies')
const loginRouter = require('./controllers/login')
const postsRouter = require('./controllers/posts')
const followRouter = require('./controllers/follow')
const commentRouter = require('./controllers/comments')
const messageRouter = require('./controllers/messages')

app.use(cors())
app.use(express.json())
app.use(sanitization)
app.use(express.static('dist'))

app.use('/api/users', usersRouter)
app.use('/api/babies', babiesRouter)
app.use('/api/login', loginRouter)
app.use('/api/posts', postsRouter)
app.use('/api/follow', followRouter)
app.use('/api/comments', commentRouter)
app.use('/api/messages', messageRouter)

app.use(express.static(path.join(__dirname, 'dist')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

module.exports = app