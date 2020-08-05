'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {


    await queryInterface.renameColumn('products', "recodeLevel", "reorderLevel");

  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
