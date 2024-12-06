const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class UserBabies extends Model {}

UserBabies.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  babyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'babies', key: 'id' },
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'userBabies'
})

module.exports = UserBabies