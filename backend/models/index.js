const User = require('./user')
const Baby = require('./baby')

// ManyToOne
User.hasMany(Baby)
Baby.belongsTo(User)

module.exports = { User, Baby }