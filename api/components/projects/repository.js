const model = require('./projectsModel');

module.exports = {
  list() {
    return model.findAll();
  },
  create(project) {
    return model.create(project, { raw: true });
  },
};
