const Value = require('../Framework/Value');

module.exports = class PictureId extends Value {
  id;

  constructor(id) {
    super();

    this.id = id;
  }

  toString() {
    return this.id;
  }
}
