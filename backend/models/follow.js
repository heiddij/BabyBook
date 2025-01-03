const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

class Follow extends Model {}

Follow.init({
  followerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
    primaryKey: true,
  },
  followingId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
    primaryKey: true,
  },
}, {
  sequelize,
  modelName: 'follow',
  timestamps: true, 
  underscored: true,
})

module.exports = Follow
