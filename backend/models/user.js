const { Model, DataTypes } = require('sequelize')
const bcrypt = require('bcrypt')

const { sequelize } = require('../util/db')

class User extends Model {}

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstname: {
    type: DataTypes.STRING(30),
    allowNull: false
  },
  lastname: {
    type: DataTypes.STRING(30),
    allowNull: false
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      len: [3, 20]
    },
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.VIRTUAL,
    validate: {
      len: [6, 50],
      is: {
        args: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,50}$/
      }
    },
    set(value) {
      // Hash the password and store it in passwordHash
      this.setDataValue('passwordHash', bcrypt.hashSync(value, 10))
    }
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'user',
  defaultScope: {
    attributes: { exclude: ['passwordHash'] },
  },
})

module.exports = User