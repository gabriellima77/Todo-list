const express = require('express');
const tasksRouter = require('./components/tasks');
const projectsRouter = require('./components/projects');
const createTables = require('./components/database/createTables');
const acceptedTypes = require('./components/serializer').acceptedTypes;
const config = require('config');
const { SerializerError } = require('./components/serializer');
const NotFound = require('./components/error/NotFound');
const ValueIsNotValid = require('./components/error/ValueIsNotValid');
const app = express();

module.exports = () => {
  app.use(express.json());
  app.use((req, res, next) => {
    let contentType = req.header('Accept');
    if (contentType === '*/*') contentType = 'application/json';
    const isAcceptedType = acceptedTypes.includes(contentType);
    if (!isAcceptedType) {
      res.status(406).end();
      return;
    }
    res.setHeader('Content-Type', contentType);
    res.set('X-Powered-By', 'Todo List');
    next();
  });

  app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', config.get('api.allowedPage'));
    next();
  });

  app.use('/api/projects', projectsRouter);
  app.use((error, _, res, next) => {
    const contentType = res.getHeader('Content-Type');
    let status = 500;
    if (error instanceof NotFound) status = 404;
    else if (error instanceof ValueIsNotValid) status = 406;
    const serializer = new SerializerError(contentType);
    res.status(status).send(serializer.serialize(error));
  });

  createTables()
    .then(() => {
      console.log('Tabelas criadas com sucesso!');
      app.listen(config.get('api.port'), () => console.log('Server On!'));
    })
    .catch(console.log);
};
