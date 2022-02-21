const model = require('./tasksModel');

module.exports = () => model.sync();
