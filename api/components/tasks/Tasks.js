const repository = require('./repository');

class Tasks {
  constructor({ id, text }) {
    this.text = text;
    this.id = id;
  }

  list() {
    return repository.list();
  }

  async create() {
    const newTask = {};
    const key = 'text';
    const value = this[key];
    const isValidValue = typeof value === 'string' && value;
    if (!isValidValue) throw new Error('Value is not valid!');
    newTask[key] = value;
    return repository.create(newTask);
  }
}

module.exports = Tasks;
