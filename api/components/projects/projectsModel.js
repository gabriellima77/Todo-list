const Sequelize = require('sequelize');
const instance = require('../database');

const column = {
  name: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
};

const options = {
  freezeTable: true,
  tableName: 'projects',
  timestamps: true,
  createdAt: 'dataCriacao',
  updatedAt: 'dataAtualizacao',
  version: 'versao',
};

module.exports = instance.define('projeto', column, options);
