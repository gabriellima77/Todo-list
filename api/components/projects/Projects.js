const ValueIsNotValid = require('../error/ValueIsNotValid');
const repository = require('./repository');

class Projects {
  constructor({ id, name, task }) {
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
}

module.exports = Projects;
