const Money = require('./Money');

module.exports = class Price extends Money {
  constructor(amount) {
    if (amount < 0) {
      throw new Error('Price cannot be negative');
    }
  }
}
