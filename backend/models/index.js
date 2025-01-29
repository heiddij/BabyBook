const User = require('./user')
const Baby = require('./baby')
const Post = require('./post')
const Follow = require('./follow')
const Like = require('./like')
const Comment = require('./comment')

User.hasMany(Baby)
Baby.belongsTo(User)

Baby.hasMany(Post)
Post.belongsTo(Baby)

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

Post.hasMany(Comment)
Comment.belongsTo(Post)
User.hasMany(Comment)
Comment.belongsTo(User)

module.exports = { User, Baby, Post, Follow, Like, Comment }