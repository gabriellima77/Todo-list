const NotFound = require('../error/NotFound');
const ValueIsNotValid = require('../error/ValueIsNotValid');
const repository = require('./repository');

class Tasks {
  constructor({ id, text, project }) {
    this.text = text;
    this.id = id;
    this.project = project;
  }

  list() {
    return repository.list();
  }

  async load() {
    const task = await repository.load(this.id);
    if (!task) throw new NotFound();
    const { text, dataCriacao, dataAtualizacao, project } = task;
    this.text = text;
    this.dataCriacao = dataCriacao;
    this.dataAtualizacao = dataAtualizacao;
    this.project = project;
  }

  async create() {
    const newTask = {};
    const keys = ['text', 'project'];
    keys.forEach((key) => {
      const value = this[key];
      const isValidValue = typeof value === 'string' && value;
      if (!isValidValue) throw new ValueIsNotValid();
      newTask[key] = value;
    });
    const { id } = await repository.create(newTask);
    this.id = id;
  }

  async update(changes) {
    this.load();
    const data = {};
    const keys = ['text', 'project'];
    keys.forEach((key) => {
      const hasProperty = changes.hasOwnProperty(key);
      if (!hasProperty) throw new ValueIsNotValid();
      const value = this[key];
      const isValidValue = typeof value === 'string' && value;
      if (!isValidValue) throw new ValueIsNotValid();
      newTask[key] = value;
      data[key] = value;
    });

    return repository.update(this.id, data);
  }

  async delete() {
    await this.load();
    return repository.delete(this.id);
  }
}

module.exports = Tasks;
