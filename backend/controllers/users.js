const router = require('express').Router()

const { User, Baby } = require('../models')

router.get('/', async (req, res) => {
    const users = await User.findAll({
        include: {
          model: Baby
        }
      })
    res.json(users)
})
  
router.get('/:id', async (req, res) => {
    req.user = await User.findByPk(req.params.id)
    if (req.user) {
        res.json(req.user)
    } else {
        res.status(404).end()
    }
})

router.post('/', async (req, res) => {
    try {
      const user = await User.create(req.body)
      res.json(user.username)
    } catch(error) {
        console.error(error)
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'Käyttäjänimi on jo varattu' });
        }
        return res.status(500).json({ error: 'Jokin meni vikaan' });
    }
})

module.exports = router