require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const sanitization = require('./middlewares/sanitization')

const usersRouter = require('./controllers/users')
const babiesRouter = require('./controllers/babies')
const loginRouter = require('./controllers/login')
const postsRouter = require('./controllers/posts')
const followRouter = require('./controllers/follow')


app.use(cors())
app.use(express.json())
app.use(sanitization)

app.use('/api/users', usersRouter)
app.use('/api/babies', babiesRouter)
app.use('/api/login', loginRouter)
app.use('/api/posts', postsRouter)
app.use('/api/follow', followRouter)

module.exports = app