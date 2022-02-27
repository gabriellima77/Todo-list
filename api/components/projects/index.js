const router = require('express').Router();
const Projects = require('./Projects');
const Serializer = require('../serializer').SerializerProjects;
const tasksRouter = require('../tasks');


router.use('/:idProject/tasks', tasksRouter);

router.get('/', async (_, res) => {
  const contentType = res.getHeader('Content-Type');
  const projects = new Projects({});
  const data = await projects.list();
  const serializer = new Serializer(contentType);
  res.send(serializer.serialize(data));
});

router.post('/', async (req, res, handleError) => {
  try {
    const contentType = res.getHeader('Content-Type');
    const task = req.body;
    const projects = new Projects(task);
    await projects.create();
    const serializer = new Serializer(contentType);
    res.status(201).send(serializer.serialize(projects));
  } catch (error) {
    handleError(error);
  }
});

router.get('/:idProject', async (req, res, handleError) => {
  try {
    const contentType = res.getHeader('Content-Type');
    const { idProject } = req.params;
    const project = new Projects({ id: idProject });
    await project.load();
    const serializer = new Serializer(contentType);
    res.send(serializer.serialize(project));
  } catch (error) {
    handleError(error);
  }
});

router.put('/:idProject', async (req, res, handleError) => {
  try {
    const { idProject } = req.params;
    const changes = req.body;
    const project = new Projects({ id: idProject });
    await project.load();
    await project.update(changes);
    res.status(204).end();
  } catch (error) {
    handleError(error);
  }
});

router.delete('/:idProject', async (req, res, handleError) => {
  try {
    const { idProject } = req.params;
    const project = new Projects({ id: idProject });
    await project.load();
    await project.delete();
    res.status(204).end();
  } catch (error) {
    handleError(error);
  }
});

module.exports = router;
