class ValueIsNotValid extends Error {
  constructor(value = 'Value') {
    super(`${value} is not valid!`);
    this.name = 'ValueIsNotValid';
    this.id = 1;
  }
}

module.exports = ValueIsNotValid;
