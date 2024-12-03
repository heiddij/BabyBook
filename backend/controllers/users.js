const { User } = require('../models')
const router = require('express').Router()

router.get('/', async (req, res) => {
    console.log(User)
    const users = await User.findAll()
    res.json(users)
})

module.exports = router