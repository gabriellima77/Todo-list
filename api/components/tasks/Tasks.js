const NotFound = require('../error/NotFound');
const ValueIsNotValid = require('../error/ValueIsNotValid');
const repository = require('./repository');

class Tasks {
  constructor({ id, text, project, isDone }) {
    this.text = text;
    this.id = id;
    this.project = project;
    this.isDone = isDone;
  }

  async list() {
    return repository.list(this.project);
  }

  async load() {
    const task = await repository.load(this.id, this.project);
    if (!task) throw new NotFound();
    const { text, dataCriacao, dataAtualizacao, project, isDone } = task;
    this.text = text;
    this.dataCriacao = dataCriacao;
    this.dataAtualizacao = dataAtualizacao;
    this.project = project;
    this.isDone = isDone;
  }

  async create() {
    const newTask = {};
    let value = this.text;
    const isValidText = typeof value === 'string' && value;
    if (!isValidText) throw new ValueIsNotValid('Text');
    newTask.text = value;
    value = this.project;
    const isValidProject = typeof value === 'number' && value > 0;
    if (!isValidProject) throw new ValueIsNotValid('Project');
    newTask.project = value;
    value = this.isDone;
    if (typeof value !== 'boolean') throw new ValueIsNotValid('isDone');
    newTask.isDone = value;
    const { id } = await repository.create(newTask);
    this.id = id;
  }

  async update(changes) {
    await this.load();
    const data = {};
    const isValidText = typeof changes.text === 'string' && changes.text;
    if (!isValidText) throw new ValueIsNotValid('Text');
    data.text = changes.text;
    const hasIsDone = changes.hasOwnProperty('isDone');
    if (hasIsDone && typeof changes.isDone !== 'boolean')
      throw new ValueIsNotValid('isDone');
    else if (hasIsDone) data.isDone = changes.isDone;
    return repository.update(this.id, this.project, data);
  }

  async delete() {
    await this.load();
    return repository.delete(this.id, this.project);
  }
}

module.exports = Tasks;
