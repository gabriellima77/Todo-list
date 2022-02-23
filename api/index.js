const express = require('express');
const router = require('./components/tasks');
const createTable = require('./components/tasks/createTable');
const acceptedTypes = require('./components/serializer').acceptedTypes;
const config = require('config');
const { SerializerError } = require('./components/serializer');
const NotFound = require('./components/error/NotFound');
const ValueIsNotValid = require('./components/error/ValueIsNotValid');
const cors = require('cors');
const app = express();

module.exports = () => {
  app.use(express.json());
  app.use(cors());
  app.use((req, res, next) => {
    let contentType = req.header('Accept');
    if (contentType === '*/*') contentType = 'application/json';
    const isAcceptedType = acceptedTypes.includes(contentType);
    if (!isAcceptedType) {
      res.status(406).end();
      return;
    }
    res.setHeader('Content-Type', contentType);
    next();
  });

  app.use('/api/tasks', router);
  app.use((error, _, res, next) => {
    const contentType = res.getHeader('Content-Type');
    let status = 500;
    if (error instanceof NotFound) status = 404;
    else if (error instanceof ValueIsNotValid) status = 400;
    const serializer = new SerializerError(contentType);
    res.status(status).send(serializer.serialize(error));
  });

  createTable()
    .then(() => {
      console.log('Tabela tasks criada com sucesso!');
      app.listen(config.get('api.port'), () => console.log('Server On!'));
    })
    .catch(console.log);
};
