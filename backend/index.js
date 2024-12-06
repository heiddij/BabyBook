require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

const usersRouter = require('./controllers/users')
const babiesRouter = require('./controllers/babies')
const loginRouter = require('./controllers/login')


app.use(cors())
app.use(express.json())

app.use('/api/users', usersRouter)
app.use('/api/babies', babiesRouter)
app.use('/api/login', loginRouter)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}
  
start()



