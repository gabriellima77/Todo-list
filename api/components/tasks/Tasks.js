const repository = require('./repository');

class Tasks {
  constructor({ id, text }) {
    this.text = text;
    this.id = id;
  }

  list() {
    return repository.list();
  }

  async load() {
    const task = await repository.load(this.id);
    if (!task) throw new Error("Task doesn't exist!");
    const { text, dataCriacao, dataAtualizacao } = task;
    this.text = text;
    this.dataCriacao = dataCriacao;
    this.dataAtualizacao = dataAtualizacao;
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

  async update(changes) {
    this.load();
    const key = 'text';
    const hasProperty = changes.hasOwnProperty(key);
    if (!hasProperty) throw new Error('Value is not valid!');
    return repository.update(this.id, { text: changes[key] });
  }

  async delete() {
    await this.load();
    return repository.delete(this.id);
  }
}

module.exports = Tasks;
