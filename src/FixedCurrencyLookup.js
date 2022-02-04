const ICurrencyLookup = require('./Domain/ICurrencyLookup');
const CurrencyDetails = require('./Domain/CurrencyDetails');

module.exports = class FixedCurrencyLookup extends ICurrencyLookup {
  #currencies = new Set([
    new CurrencyDetails({ currencyCode: 'EUR', inUse: true, decimalPlaces: 2 }),
    new CurrencyDetails({ currencyCode: 'USD', inUse: true, decimalPlaces: 2 }),
  ]);

  findCurrency(currencyCode) {
    const currency = Array.from(this.#currencies).find(currency => currency.currencyCode === currencyCode);

    return currency || CurrencyDetails.None;
  }
};
