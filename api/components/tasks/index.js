const router = require('express').Router();
const Tasks = require('./Tasks');
const repository = require('./repository');
const Serializer = require('../serializer').SerializerTasks;

router.get('/', async (_, res) => {
  const contentType = res.getHeader('Content-Type');
  let data = await repository.list();
  const serializer = new Serializer(contentType);
  data = serializer.serialize(data);
  res.send(JSON.stringify(data));
});

router.post('/', async (req, res) => {
  try {
    const task = req.body;
    const tasks = new Tasks(task);
    await tasks.create();
    res.status(201).end();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const tasks = new Tasks({ id });
    await tasks.load();
    const serializer = new Serializer();
    res.send(serializer.serialize(tasks));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const tasks = new Tasks({ id });
    await tasks.delete();
    res.end();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const content = req.body;
    const tasks = new Tasks({ id });
    await tasks.update(content);
    res.end();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
