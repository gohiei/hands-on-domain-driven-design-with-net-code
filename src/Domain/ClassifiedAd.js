const ClassifiedAdId = require('./ClassifiedAdId');
const UserId = require('./UserId');

module.exports = class ClassifiedAd {
  id;
  ownerId;
  title;
  text;
  price;

  get id() { return this.id; }

  /**
   * @param {ClassifiedAdId} id
   * @param {UserId} ownerId
   */
  constructor(id, ownerId) {
    assert(typeof id === ClassifiedAdId.name);
    assert(typeof ownerId === UserId.name);

    this.id = id;
    this.ownerId = ownerId;
  }

  setTitle(title) {
    this.title = title;
  }

  updateText(text) {
    this.text = text;
  }

  updatePrice(price) {
    this.price = price;
  }
}
