const assert = require('assert');
const { v4: uuid } = require('uuid');
const { ClassifiedAd, ClassifiedAdId, UserId, ClassifiedAdTitle, ClassifiedAdText, Price, PictureSize, Uri } = require('../../Domain/index');
const FakeCurrencyLookup = require('./FakeCurrencyLookup');

describe('Classified Ad publish', function () {
  let classifiedAd;

  beforeEach(function () {
    classifiedAd = new ClassifiedAd(
      new ClassifiedAdId(uuid()),
      new UserId(uuid()),
    );
  });

  afterEach(function () {
    classifiedAd = undefined;
  });

  it('can publish a valid ad', function () {
    classifiedAd.setTitle(ClassifiedAdTitle.fromString('Test ad'));
    classifiedAd.updateText(ClassifiedAdText.fromString('Please buy my stuff'));
    classifiedAd.updatePrice(
      Price.fromDecimal(100.10, 'EUR', new FakeCurrencyLookup())
    );

    classifiedAd.addPicture(
      new Uri('https://this.is.my.fake.uri/123.jpg'),
      new PictureSize(800, 600),
    );

    classifiedAd.requestToPublish();

    assert.ok(ClassifiedAd.ClassifiedAdState.PendingReview, classifiedAd.state);
  });

  it('cannot publish without title', function () {
    classifiedAd.updateText(ClassifiedAdText.fromString('Please buy my stuff'));
    classifiedAd.updatePrice(
      Price.fromDecimal(100.10, 'EUR', new FakeCurrencyLookup())
    );

    assert.throws(() => classifiedAd.requestToPublish());
  });

  it('cannot publish without text', function () {
    classifiedAd.setTitle(ClassifiedAdTitle.fromString('Test ad'));
    classifiedAd.updatePrice(
      Price.fromDecimal(100.10, 'EUR', new FakeCurrencyLookup())
    );

    assert.throws(() => classifiedAd.requestToPublish());
  });

  it('cannot publish without price', function () {
    classifiedAd.setTitle(ClassifiedAdTitle.fromString('Test ad'));
    classifiedAd.updateText(ClassifiedAdText.fromString('Please buy my stuff'));

    assert.throws(() => classifiedAd.requestToPublish());
  });

  it('cannot publish with zero price', function () {
    classifiedAd.setTitle(ClassifiedAdTitle.fromString('Test ad'));
    classifiedAd.updateText(ClassifiedAdText.fromString('Please buy my stuff'));
    classifiedAd.updatePrice(
      Price.fromDecimal(0, 'EUR', new FakeCurrencyLookup())
    );

    assert.throws(() => classifiedAd.requestToPublish(), new Error('Entity ClassifiedAd state change rejected, Post checked failed in state 1'));
  });
});
