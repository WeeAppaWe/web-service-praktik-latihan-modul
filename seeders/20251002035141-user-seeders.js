'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    await queryInterface.bulkInsert('users', [
      {
        name: 'Agung',
        profession: 'Administrator',
        avatar: null,
        role: 'admin',
        email: 'admin@example.com',
        pass: await bcrypt.hash('admin123', 10),
        created_at: new Date(),
        updated_at: null,
        deleted_at: null
      },
      {
        name: 'Ajay',
        profession: 'Operator',
        avatar: null,
        role: 'operator',
        email: 'operator@example.com',
        pass: await bcrypt.hash('operator123', 10),
        created_at: new Date(),
        updated_at: null,
        deleted_at: null
      }
    ]);

  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('users', null, {});
  }
};
