const model = require('./tasksModel');

module.exports = {
  list() {
    return model.findAll();
  },
  create(task) {
    return model.create(task);
  },
  load(id) {
    return model.findOne({ where: { id } });
  },
  update(id, changes) {
    return model.update(changes, { where: { id } });
  },
  delete(id) {
    return model.destroy({ where: { id } });
  },
};
