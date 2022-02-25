const router = require('express').Router();
const Projects = require('./Projects');
const Serializer = require('../serializer').SerializerProjects;

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
    console.log(projects);
    const serializer = new Serializer(contentType);
    res.status(201).send(serializer.serialize(projects));
  } catch (error) {
    handleError(error);
  }
});

router.get('/:idProject');

router.put('/:idProject');

router.delete('/:idProject');

module.exports = router;
