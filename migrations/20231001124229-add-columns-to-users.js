'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'last_name', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('users', 'first_name', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('users', 'phone_number', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('users', 'address', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('users', 'avatar', {
      type: Sequelize.TEXT,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'last_name');
    await queryInterface.removeColumn('users', 'first_name');
    await queryInterface.removeColumn('users', 'phone_number');
    await queryInterface.removeColumn('users', 'address');
    await queryInterface.removeColumn('users', 'avatar');
  },
};
