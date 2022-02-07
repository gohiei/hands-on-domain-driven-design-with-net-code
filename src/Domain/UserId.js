const Value = require('../Framework/Value');

module.exports = class UserId extends Value {
  id;

  constructor(id) {
    super();

    if (id === undefined) {
      throw new Error('User id cannot be empty');
    }

    this.id = id;
  }

  toString() {
    return this.id;
  }
}
