const NotFound = require('../error/NotFound');
const ValueIsNotValid = require('../error/ValueIsNotValid');
const repository = require('./repository');

class Tasks {
  constructor({ id, text, project }) {
    this.text = text;
    this.id = id;
    this.project = project;
  }

  async list() {
    return repository.list(this.project);
  }

  async load() {
    const task = await repository.load(this.id, this.project);
    if (!task) throw new NotFound();
    const { text, dataCriacao, dataAtualizacao, project } = task;
    this.text = text;
    this.dataCriacao = dataCriacao;
    this.dataAtualizacao = dataAtualizacao;
    this.project = project;
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
    const { id } = await repository.create(newTask);
    this.id = id;
  }

  async update(changes) {
    await this.load();
    const data = {};
    const isValidText = typeof changes.text === 'string' && changes.text;
    if (!isValidText) throw new ValueIsNotValid('Text');
    data.text = changes.text;
    return repository.update(this.id, this.project, data);
  }

  async delete() {
    await this.load();
    return repository.delete(this.id, this.project);
  }
}

module.exports = Tasks;
