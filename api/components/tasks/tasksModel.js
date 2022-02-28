const Sequelize = require('sequelize');
const instance = require('../database');

const columns = {
  text: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  project: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: require('../projects/projectsModel'),
      key: 'id',
    },
  },
};

const options = {
  freezeTable: true,
  tableName: 'tasks',
  timestamps: true,
  createdAt: 'dataCriacao',
  updatedAt: 'dataAtualizacao',
};

module.exports = instance.define('task', columns, options);
