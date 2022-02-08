const assert = require('assert');
const {
  ClassifiedAd,
  ClassifiedAdId,
  ClassifiedAdTitle,
  ClassifiedAdText,
  Price,
  UserId,
} = require('../Domain/index');

module.exports = class ClassifiedAdDTO {
  static toData(entity, data = {}) {
    assert(entity instanceof ClassifiedAd);

    data.id = entity.id.id;
    data.ownerId = entity.ownerId.id;
    data.title = entity?.title?.title;
    data.text = entity?.text?.text;
    data.price = entity?.price?.amount;
    data.currency = entity?.price?.currency.currencyCode;
    data.state = entity.state;
    data.approvedBy = entity.approvedBy;

    return data;
  }

  static toDomainEntity(data, currencyLookup) {
    const classifiedAd = new ClassifiedAd();

    classifiedAd.id = new ClassifiedAdId(data.id);
    classifiedAd.ownerId = new UserId(data.ownerId);

    if (data.title) {
      classifiedAd.title = ClassifiedAdTitle.fromString(data.title);
    }

    if (data.text) {
      classifiedAd.text = ClassifiedAdText.fromString(data.text);
    }

    if (data.currency) {
      classifiedAd.price = Price.fromCurrencyLookup(data.amount || 0, data.currency, currencyLookup);
    }

    classifiedAd.state = data.state;
    classifiedAd.approvedBy = data?.approvedBy;

    return classifiedAd;
  }
}
