const router = require('express').Router()
const jwt = require('jsonwebtoken')

const { SECRET } = require('../util/config')
const { Baby, User } = require('../models')

const babyFinder = async (req, res, next) => {
    req.baby = await Baby.findByPk(req.params.id)
    next()
}

const tokenExtractor = (req, res, next) => {
    const authorization = req.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      try {
        console.log(authorization.substring(7))
        req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
      } catch (error){
        console.log(error)
        return res.status(401).json({ error: 'token invalid' })
      }
    } else {
      return res.status(401).json({ error: 'token missing' })
    }
    next()
}

router.get('/', async (req, res) => {
    const babies = await Baby.findAll()
    res.json(babies)
})
  
router.get('/:id', babyFinder, async (req, res) => {
if (req.baby) {
    res.json(req.baby)
} else {
    res.status(404).end()
}
})

router.post('/', tokenExtractor, async (req, res) => {
    try {
      const user = await User.findByPk(req.decodedToken.id)
      const baby = await Baby.create({ ...req.body, userId: user.id })
      res.json(baby)
    } catch(error) {
      return res.status(400).json({ error })
    }
})

router.delete('/:id', babyFinder, async (req, res) => {
if (req.baby) {
    await req.baby.destroy()
}
res.status(204).end()
})


router.put('/:id', babyFinder, async (req, res) => {
if (req.baby) {
    req.baby.firstname = req.body.firstname
    await req.baby.save()
    res.json(req.baby)
} else {
    res.status(404).end()
}
})

module.exports = router