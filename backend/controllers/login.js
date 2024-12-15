const jwt = require('jsonwebtoken')
const router = require('express').Router()
const bcrypt = require('bcrypt')

const { SECRET } = require('../util/config')
const User = require('../models/user')

router.post('/', async (request, response) => {
    const { username, password } = request.body

  const user = await User.scope(null).findOne({ // Disable the default scope so that the passwordHash is included
    where: {
      username: username
    }
  })

  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'Väärä käyttäjänimi tai salasana'
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(userForToken, SECRET)

  response
    .status(200)
    .send({ token, username: user.username })
})

module.exports = router