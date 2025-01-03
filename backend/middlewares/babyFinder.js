const { Baby } = require('../models')

const babyFinder = async (req, res, next) => {
  req.baby = await Baby.findByPk(req.params.id)
  next()
}

module.exports = babyFinder