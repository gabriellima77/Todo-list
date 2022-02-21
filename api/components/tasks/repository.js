const model = require('./tasksModel');

module.exports = {
  list() {
    return model.findAll();
  },
  create(task) {
    return model.create(task);
  },
};
