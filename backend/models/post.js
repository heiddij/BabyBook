const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Post extends Model {}

Post.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  post: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  image: {
    type: DataTypes.STRING
  }
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'post'
})

module.exports = Post