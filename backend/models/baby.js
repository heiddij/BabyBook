const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Baby extends Model {}

Baby.init({
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
    birthdate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    birthplace: {
        type: DataTypes.STRING(30)
    },
    profilepic: {
        type: DataTypes.STRING
    }
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'baby'
})

module.exports = Baby