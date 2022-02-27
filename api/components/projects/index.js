const router = require('express').Router();
const Projects = require('./Projects');
const Serializer = require('../serializer').SerializerProjects;
const tasksRouter = require('../tasks');

router.options('/', (_, res) => {
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  res.status(204).end();
});

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

router.options('/:idProject', (_, res) => {
  res.set('Access-Control-Allow-Methods', 'GET, PUT, DELETE');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  res.status(204).end();
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

const validateProject = async (req, _, next) => {
  try {
    const { idProject: id } = req.params;
    const project = new Projects({ id });
    await project.load();
    req.project = project;
    next();
  } catch (error) {
    next(error);
  }
};

router.use('/:idProject/tasks', validateProject, tasksRouter);

module.exports = router;
