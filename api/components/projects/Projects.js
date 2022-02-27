const NotFound = require('../error/NotFound');
const ValueIsNotValid = require('../error/ValueIsNotValid');
const repository = require('./repository');

class Projects {
  constructor({ id, name }) {
    this.id = id;
    this.name = name;
  }

  async list() {
    return repository.list();
  }

  async create() {
    const isValidName = typeof this.name === 'string' && this.name;
    if (!isValidName) throw new ValueIsNotValid('Name');
    const { id, dataCriacao, dataAtualizacao } = await repository.create({
      name: this.name,
    });
    this.id = id;
    this.dataCriacao = dataCriacao;
    this.dataAtualizacao = dataAtualizacao;
  }

  async load() {
    const project = await repository.load(this.id);
    if (!project) throw new NotFound('Project');
    this.id = project.id;
    this.name = project.name;
    this.dataCriacao = project.dataCriacao;
    this.dataAtualizacao = project.dataAtualizacao;
  }

  update(changes) {
    const data = {};
    const isValidName = typeof changes.name === 'string' && changes.name;
    if (!isValidName) throw new ValueIsNotValid('Name');
    data.name = changes.name;
    return repository.update(this.id, data);
  }

  delete() {
    return repository.delete(this.id);
  }
}

module.exports = Projects;
