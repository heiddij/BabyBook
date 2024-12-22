const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('babies', 'profilepic', {
      type: DataTypes.STRING
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('babies', 'profilepic')
  },
}