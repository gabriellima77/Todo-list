const model = require('../projects/projectsModel');
const keys = ['home', 'today', 'week'];

module.exports =  async function create() {
  const result = await model.findAll({ raw: true });
  if (result.length < 1) {
    for (let i = 0; i < keys.length; i++) {
      await model.create({ name: keys[i] }, { raw: true });
    }
    console.log('Values are ready!');
  } else console.log('Values already exist!');
}

