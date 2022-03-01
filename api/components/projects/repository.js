const model = require('./projectsModel');
const tasksModel = require('../tasks/tasksModel');

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
  async delete(id) {
    const tasks = await tasksModel.findAll({
      where: { project: id },
      raw: true,
    });
    const tasksId = tasks.map((task) => task.id);
    await tasksModel.destroy({ where: { id: tasksId } });
    return model.destroy({ where: { id }, force: true });
  },
};
