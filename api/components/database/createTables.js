const models = [
  require('../projects/projectsModel'),
  require('../tasks/tasksModel'),
];

module.exports = async () => {
  for (let i = 0; i < models.length; i++) {
    await models[i].sync();
  }
};
