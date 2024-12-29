const User = require('./user')
const Baby = require('./baby')
const Post = require('./post')

// ManyToOne
User.hasMany(Baby)
Baby.belongsTo(User)

Baby.hasMany(Post)
Post.belongsTo(Baby)

module.exports = { User, Baby, Post }