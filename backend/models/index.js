const User = require('./user')
const Baby = require('./baby')

// ManyToOne
User.hasMany(Baby)
Baby.belongsTo(User)

Baby.sync({ alter: true })
User.sync({ alter: true })

module.exports = { User, Baby }