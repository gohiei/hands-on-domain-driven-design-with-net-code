const Money = require('./Money');

module.exports = class Price extends Money {
  constructor(amount, currency) {
    if (amount < 0) {
      throw new Error('Price cannot be negative');
    }

    super(amount, currency);
  }
}
