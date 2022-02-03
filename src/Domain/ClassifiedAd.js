const assert = require('assert');
const ClassifiedAdId = require('./ClassifiedAdId');
const ClassifiedAdTitle = require('./ClassifiedAdTitle');
const ClassifiedAdText = require('./ClassifiedAdText');
const Price = require('./Price');
const UserId = require('./UserId');
const InvalidEntityStateException = require('./InvalidEntityStateException');

module.exports = class ClassifiedAd {
  id;
  ownerId;
  title;
  text;
  price;
  state;
  approvedBy;

  static ClassifiedAdState = {
    PendingReview: 1,
    Active: 2,
    Inactive: 3,
    MarkedAsSold: 4,
  };

  get id() { return this.id; }

  /**
   * @param {ClassifiedAdId} id
   * @param {UserId} ownerId
   */
  constructor(id, ownerId) {
    assert(id instanceof ClassifiedAdId);
    assert(ownerId instanceof UserId);

    this.id = id;
    this.ownerId = ownerId;
    this.state = ClassifiedAd.ClassifiedAdState.Inactive;
  }

  setTitle(title) {
    assert(title instanceof ClassifiedAdTitle);

    this.title = title;
  }

  updateText(text) {
    assert(text instanceof ClassifiedAdText);

    this.text = text;
  }

  updatePrice(price) {
    assert(price instanceof Price);

    this.price = price;
  }

  requestToPublish() {
    this.state = ClassifiedAd.ClassifiedAdState.PendingReview;
    this.#ensureValidState();
  }

  #ensureValidState() {
    if (!this.id) {
      throw new InvalidEntityStateException(this, `Post-checked failed in state ${this.state}`);
    }

    if (!this.ownerId) {
      throw new InvalidEntityStateException(this, `Post-checked failed in state ${this.state}`);
    }

    if (this.state === ClassifiedAd.ClassifiedAdState.PendingReview) {
      if (!this.title || !this.text || !this.price || this.price.amount <= 0) {
        throw new InvalidEntityStateException(this, `Post checked failed in state ${this.state}`);
      }
    }

    if (this.state === ClassifiedAd.ClassifiedAdState.Active) {
      if (!this.title || !this.text || !this.price || this.price.amount <= 0 || !this.approvedBy) {
        throw new InvalidEntityStateException(this, `Post checked failed in state ${this.state}`);
      }
    }
  }
}
