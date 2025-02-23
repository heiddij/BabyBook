const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')
const { server } = require('./util/server')

const start = async () => {
  await connectToDatabase()
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}
  
start()