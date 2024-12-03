require('dotenv').config()
const express = require('express')
const app = express()
const { sequelize } = require('./util/db');

const usersRouter = require('./controllers/users')

app.use(express.json())

app.use('/api/users', usersRouter)

const start = async () => {
    (async () => {
        try {
          await sequelize.authenticate();
          console.log('Database connection successful.');
        } catch (error) {
          console.error('Unable to connect to the database:', error);
        }
    })();

    const PORT = process.env.PORT || 3001
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
}
  
start()



