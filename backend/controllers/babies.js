const router = require('express').Router()

const { Baby } = require('../models')

const babyFinder = async (req, res, next) => {
    req.baby = await Baby.findByPk(req.params.id)
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

router.post('/', async (req, res) => {
    try {
      const baby = await Baby.create(req.body)
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