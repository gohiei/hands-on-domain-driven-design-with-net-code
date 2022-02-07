const Value = require('../Framework/Value');

module.exports = class Uri extends Value {
  url;

  constructor(url) {
    super();

    this.url = url;
  }

  toString() {
    return this.url;
  }
}
