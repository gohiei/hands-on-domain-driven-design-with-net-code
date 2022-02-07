const assert = require('assert');
const Value = require('../Framework/Value');
const ICurrencyLookup = require('./ICurrencyLookup');
const CurrencyDetails = require('./CurrencyDetails');

module.exports = class Money extends Value {
  static DefaultCurrency = 'EUR';

  amount;
  currency;

  constructor(amount, currency) {
    assert(currency instanceof CurrencyDetails);

    super();

    if (currency === CurrencyDetails.None) {
      throw new Error('Currency must be specified');
    }

    if (Number(amount).toFixed(currency.decimalPlaces) != amount) {
      throw new Error(`Amount cannot have more than ${currency.decimalPlaces} decimals`);
    }

    this.amount = amount;
    this.currency = currency;
  }

  static fromCurrency(amount, currency) {
    assert(currency instanceof CurrencyDetails);

    return new this(amount, currency);
  }

  static fromCurrencyLookup(amount, currencyCode = 'EUR', currencyLookup) {
    const currency = currencyLookup.findCurrency(currencyCode);

    if (!currency || !currency.inUse) {
      throw new Error(`Currency ${currencyCode} is not valid`);
    }

    return new this(amount, currency);
  }

  static fromDecimal(amount, currency = DefaultCurrency, currencyLookup) {
    assert(currencyLookup instanceof ICurrencyLookup);

    return this.fromCurrencyLookup(amount, currency, currencyLookup);
  }

  static fromString(amount, currency = DefaultCurrency, currencyLookup) {
    assert(currencyLookup instanceof ICurrencyLookup);

    return this.fromCurrencyLookup(Number.parseFloat(amount), currency, currencyLookup);
  }

  get amount() {
    return this.amount;
  }

  equals(other) {
    assert(other instanceof Money);

    return (this.currency === other.currency) && (this.amount === other.amount);
  }

  add(summand) {
    assert(summand instanceof Money);

    if (this.currency !== summand.currency) {
      throw new Error('Cannot sum amounts with different currencies');
    }

    return new this.constructor(this.amount + summand.amount, this.currency);
  }

  subtract(subtrashend) {
    assert(subtrashend instanceof Money);

    if (this.currency !== subtrashend.currency) {
      throw new Error('Cannot subtract amounts with differenet currencies');
    }

    return new this.constructor(this.amount - subtrashend.amount, this.currency);
  }

  toString() {
    return `${this.currency.currencyCode} ${this.amount}`;
  }
}
