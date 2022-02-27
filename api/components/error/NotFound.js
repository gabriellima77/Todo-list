class NotFound extends Error {
  constructor(type = 'Task') {
    super(`${type} doesn't exist!`);
    this.name = 'NotFound';
    this.id = 0;
  }
}

module.exports = NotFound;
