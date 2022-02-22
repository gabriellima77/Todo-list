class ValueIsNotValid extends Error {
  constructor() {
    super('Value is not valid!');
    this.name = 'ValueIsNotValid';
    this.id = 1;
  }
}

module.exports = ValueIsNotValid;