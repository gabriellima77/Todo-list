const model = require('./projectsModel');

module.exports = {
  list() {
    return model.findAll();
  },
  create(project) {
    return model.create(project, { raw: true });
  },
  load(id) {
    return model.findOne({ where: { id }, raw: true });
  },
  update(id, changes) {
    return model.update(changes, { where: { id } });
  },
  delete(id) {
    return model.destroy({ where: { id } });
  },
};
