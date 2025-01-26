const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

class Like extends Model {}

Like.init({
  postId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'posts', key: 'id' },
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
    primaryKey: true,
  },
}, {
  sequelize,
  modelName: 'like',
  timestamps: true, 
  underscored: true,
})

module.exports = Like
