const app = require('./app')
const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')
const { createServer } = require('./util/server')

const start = async () => {
  await connectToDatabase()
  createServer()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}
  
start()