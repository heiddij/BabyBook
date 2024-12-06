const { Model, DataTypes } = require('sequelize')
const bcrypt = require('bcrypt');

const { sequelize } = require('../util/db')

class User extends Model {}

User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    passwordHash: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.VIRTUAL,
        set(value) {
            // Hash the password and store it in passwordHash
            this.setDataValue('passwordHash', bcrypt.hashSync(value, 10));
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