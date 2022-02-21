const router = require('express').Router();
const Tasks = require('./Tasks');
const repository = require('./repository');
const Serializer = require('../Serializer/index').SerializerTasks;

router.get('/', async (_, res) => {
  const contentType = res.getHeader('Content-Type');
  console.log(contentType);
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

router.delete('/:id', (req, res) => {});

router.put('/:id', (req, res) => {});

module.exports = router;
