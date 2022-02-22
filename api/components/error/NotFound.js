class NotFound extends Error {
  constructor() {
    super("Task doesn't exist!");
    this.name = 'NotFound';
    this.id = 0;
  }
}

module.exports = NotFound;
