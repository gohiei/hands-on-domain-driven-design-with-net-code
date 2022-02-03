const assert = require('assert');
const Money = require('../../Domain/Money');
const FakeCurrencyLookup = require('./FakeCurrencyLookup');

describe('Money', function () {
  const currencyLookup = new FakeCurrencyLookup();

  it('Two of same amount should be equal', function () {
    const firstAmount = Money.fromDecimal(5, 'EUR', currencyLookup);
    const secondAmount = Money.fromDecimal(5, 'EUR', currencyLookup);

    assert.ok(firstAmount.equals(secondAmount));
  });

  it('Two of same amount but differenct currencies should not be equal', function () {
    const firstAmount = Money.fromDecimal(5, 'EUR', currencyLookup);
    const secondAmount = Money.fromDecimal(5, 'USD', currencyLookup);

    assert.ok(!firstAmount.equals(secondAmount));
  });

  it('FromString and fromDecimal should be equal', function () {
    const firstAmount = Money.fromDecimal(5, 'EUR', currencyLookup);
    const secondAmount = Money.fromString('5.00', 'EUR', currencyLookup);

    assert.ok(firstAmount.equals(secondAmount));


  });

  it('Sum of money gives full amount', function () {
    const coin1 = Money.fromDecimal(1, 'EUR', currencyLookup);
    const coin2 = Money.fromDecimal(2, 'EUR', currencyLookup);
    const coin3 = Money.fromDecimal(2, 'EUR', currencyLookup);
    const banknote = Money.fromDecimal(5, 'EUR', currencyLookup);

    assert.ok(banknote.equals(coin1.add(coin2).add(coin3)));
  });

  it('Unused currency shoud not be allowed', function () {
    assert.throws(() => {
      Money.fromDecimal(100, 'DEM', currencyLookup);
    });
  });

  it('Unknown currency should not be allowed', function () {
    assert.throws(() => {
      Money.fromDecimal(100, 'WHAT?', currencyLookup);
    });
  });

  it('Throw when too many decimal places', function () {
    assert.throws(() => {
      Money.fromDecimal(100.123, 'EUR', currencyLookup);
    });
  });

  it('Throw on adding different currencies', function () {
    const firstAmount = Money.fromDecimal(5, 'USD', currencyLookup);
    const secondAmount = Money.fromDecimal(5, 'EUR', currencyLookup);

    assert.throws(() => {
      firstAmount.add(secondAmount)
    });
  });

  it('Throw on subtracting different currencies', function () {
    const firstAmount = Money.fromDecimal(5, 'USD', currencyLookup);
    const secondAmount = Money.fromDecimal(5, 'EUR', currencyLookup);

    assert.throws(() => {
      firstAmount.subtract(secondAmount)
    });
  });
});
