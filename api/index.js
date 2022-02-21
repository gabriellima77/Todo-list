const express = require('express');
const router = require('./components/tasks');
const createTable = require('./components/tasks/createTable');
const acceptedTypes = require('./components/Serializer').acceptedTypes;
const config = require('config');
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
    next();
  });

  app.use('/api/tasks', router);

  createTable()
    .then(() => {
      console.log('Tabela tasks criada com sucesso!');
      app.listen(config.get('api.port'), () => console.log('Server On!'));
    })
    .catch(console.log);
};
