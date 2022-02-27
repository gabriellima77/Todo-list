const router = require('express').Router({ mergeParams: true });
const Tasks = require('./Tasks');
const Serializer = require('../serializer').SerializerTasks;

router.options('/', (_, res) => {
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  res.status(204).end();
});

router.get('/', async (req, res) => {
  const contentType = res.getHeader('Content-Type');
  const { id: project } = req.project;
  const tasks = new Tasks({ project });
  const data = await tasks.list();
  const serializer = new Serializer(contentType);
  res.send(serializer.serialize(data));
});

router.post('/', async (req, res, handleError) => {
  try {
    const contentType = res.getHeader('Content-Type');
    const { id: project } = req.project;
    const task = req.body;
    const tasks = new Tasks({ ...task, project });
    await tasks.create();
    const serializer = new Serializer(contentType);
    res.status(201).send(serializer.serialize(tasks));
  } catch (error) {
    handleError(error);
  }
});

router.options('/:id', (_, res) => {
  res.set('Access-Control-Allow-Methods', 'GET, PUT, DELETE');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  res.status(204).end();
});

router.get('/:id', async (req, res, handleError) => {
  try {
    const { id: project } = req.project;
    const { id } = req.params;
    const tasks = new Tasks({ id, project });
    await tasks.load();
    const serializer = new Serializer();
    res.send(serializer.serialize(tasks));
  } catch (error) {
    handleError(error);
  }
});

router.delete('/:id', async (req, res, handleError) => {
  try {
    const { id: project } = req.project;
    const { id } = req.params;
    const tasks = new Tasks({ id, project });
    await tasks.delete();
    res.end();
  } catch (error) {
    handleError(error);
  }
});

router.put('/:id', async (req, res, handleError) => {
  try {
    const { id } = req.params;
    const { id: project } = req.project;
    const content = req.body;
    const tasks = new Tasks({ id, project });
    await tasks.update(content);
    res.status(204).end();
  } catch (error) {
    handleError(error);
  }
});

module.exports = router;
