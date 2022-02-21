const Sequelize = require('sequelize');
const instance = require('../database');

const column = {
  text: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
};

const options = {
  freezeTable: true,
  tableName: 'tasks',
  timestamps: true,
  createdAt: 'dataCriacao',
  updatedAt: 'dataAtualizacao',
};

module.exports = instance.define('task', column, options);
