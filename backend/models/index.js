const User = require('./user')
const Baby = require('./baby')
const Post = require('./post')
const Follow = require('./follow')
const Like = require('./like')

// ManyToOne
User.hasMany(Baby)
Baby.belongsTo(User)

Baby.hasMany(Post)
Post.belongsTo(Baby)

// ManyToMany
User.belongsToMany(User, { 
  through: Follow, 
  as: 'followers', 
  foreignKey: 'followingId', 
  otherKey: 'followerId',
})
User.belongsToMany(User, { 
  through: Follow, 
  as: 'following', 
  foreignKey: 'followerId', 
  otherKey: 'followingId',
})

User.belongsToMany(Post, { through: Like, as: 'likes' })
Post.belongsToMany(User, { through: Like, as: 'likers' })

module.exports = { User, Baby, Post, Follow, Like }