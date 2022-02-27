const model = require('./tasksModel');

module.exports = {
  list(project) {
    return model.findAll({ where: { project } });
  },
  create(task) {
    return model.create(task, { raw: true });
  },
  load(id, project) {
    return model.findOne({ where: { id, project } });
  },
  update(id, project, changes) {
    return model.update(changes, { where: { id, project } });
  },
  delete(id, project) {
    return model.destroy({ where: { id, project } });
  },
};
