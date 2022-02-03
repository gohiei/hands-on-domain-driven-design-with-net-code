module.exports = class CurrencyDetails {
  currencyCode;
  inUse;
  decimalPlaces;

  static None = new CurrencyDetails({ currencyCode: 'NONE' });

  constructor({ currencyCode, inUse = false, decimalPlaces = 0 }) {
    this.currencyCode = currencyCode;
    this.inUse = inUse;
    this.decimalPlaces = decimalPlaces;
  }
}
