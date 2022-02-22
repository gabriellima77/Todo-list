const router = require('express').Router();
const Tasks = require('./Tasks');
const repository = require('./repository');
const Serializer = require('../serializer').SerializerTasks;

router.get('/', async (_, res) => {
  const contentType = res.getHeader('Content-Type');
  let data = await repository.list();
  const serializer = new Serializer(contentType);
  res.send(serializer.serialize(data));
});

router.post('/', async (req, res, handleError) => {
  try {
    const task = req.body;
    const tasks = new Tasks(task);
    await tasks.create();
    res.status(201).end();
  } catch (error) {
    handleError(error);
  }
});

router.get('/:id', async (req, res, handleError) => {
  try {
    const { id } = req.params;
    const tasks = new Tasks({ id });
    await tasks.load();
    const serializer = new Serializer();
    res.send(serializer.serialize(tasks));
  } catch (error) {
    handleError(error);
  }
});

router.delete('/:id', async (req, res, handleError) => {
  try {
    const { id } = req.params;
    const tasks = new Tasks({ id });
    await tasks.delete();
    res.end();
  } catch (error) {
    handleError(error);
  }
});

router.put('/:id', async (req, res, handleError) => {
  try {
    const { id } = req.params;
    const content = req.body;
    const tasks = new Tasks({ id });
    await tasks.update(content);
    res.end();
  } catch (error) {
    handleError(error);
  }
});

module.exports = router;
