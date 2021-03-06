const Value = require('../Framework/Value');

module.exports = class ClassifiedAdId extends Value {
  id;

  constructor(id) {
    super();

    if (id === undefined) {
      throw new Error('Classified Ad id cannot be empty');
    }

    this.id = id;
  }

  toString() {
    return this.id;
  }
}
