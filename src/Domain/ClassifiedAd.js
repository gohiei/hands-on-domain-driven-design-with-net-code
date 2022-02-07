const assert = require('assert');
const { v4: uuid } = require('uuid');
const AggregateRoot = require('../Framework/AggregateRoot');
const Events = require('./Events');
const ClassifiedAdId = require('./ClassifiedAdId');
const ClassifiedAdTitle = require('./ClassifiedAdTitle');
const ClassifiedAdText = require('./ClassifiedAdText');
const Price = require('./Price');
const UserId = require('./UserId');
const Picture = require('./Picture');
const PictureSize = require('./PictureSize');
const PictureId = require('./PictureId');
const Uri = require('./Uri');
const InvalidEntityStateException = require('./InvalidEntityStateException');

module.exports = class ClassifiedAd extends AggregateRoot {
  id;
  ownerId;
  title;
  text;
  price;
  state;
  approvedBy;
  pictures;

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

    super();

    this.pictures = [];
    this.apply(new Events.ClassifiedAdCreated({
      id,
      ownerId,
    }));
  }

  setTitle(title) {
    assert(title instanceof ClassifiedAdTitle);

    this.apply(new Events.ClassifiedAdTitleChanged({ id: this.id, title }));
  }

  updateText(text) {
    assert(text instanceof ClassifiedAdText);

    this.apply(new Events.ClassifiedAdTextUpdated({ id: this.id, text }));
  }

  updatePrice(price) {
    assert(price instanceof Price);

    // @todo: remove
    this._currency = price.currency;

    this.apply(new Events.ClassifiedAdPriceUpdated({
      id: this.id,
      price: price.amount,
      currencyCode: price.currency.currencyCode,
    }));
  }

  requestToPublish() {
    this.apply(new Events.ClassifiedAdSentForReview({ id: this.id }));
  }

  resizePicture(pictureId, newSize) {
    assert(pictureId instanceof PictureId);
    assert(newSize instanceof PictureSize);

    const picture = this.findPicture(pictureId);
    if (!picture) {
      throw new Error('Cannot resize a picture that I don\'t have');
    }

    picture.resize(newSize);
  }

  findPicture(id) {
    assert(id instanceof PictureId);

    return this.pictures.find(picture => picture.id === id);
  }

  firstPicture() {
    if (this.pictures.length === 0) {
      return new Picture();
    }

    const pictures = [ ...this.pictures ];

    pictures.sort((a, b) => a.sort >= b.sort);

    return pictures[0];
  }

  addPicture(pictureUri, size) {
    assert(pictureUri instanceof Uri);
    assert(size instanceof PictureSize);

    const maxOrder = Math.max(...this.pictures.map(p => p.order), 0);

    this.apply(new Events.PictureAddedToAClassifiedAd({
      pictureId: uuid(),
      classifiedAdId: this.id,
      url: pictureUri.toString(),
      height: size.height,
      width: size.width,
      order: maxOrder + 1,
    }));
  }

  when(event) {
    if (event instanceof Events.ClassifiedAdCreated) {
      this.id = new ClassifiedAdId(event.id);
      this.ownerId = new UserId(event.ownerId);
      this.state = ClassifiedAd.ClassifiedAdState.Inactive;
    }

    if (event instanceof Events.ClassifiedAdTitleChanged) {
      this.title = new ClassifiedAdTitle(event.title);
    }

    if (event instanceof Events.ClassifiedAdTextUpdated) {
      this.text = new ClassifiedAdText(event.text);
    }

    if (event instanceof Events.ClassifiedAdPriceUpdated) {
      // @todo: remove this._currency, and use event.currencyCode
      this.price = new Price(event.price, this._currency);
    }

    if (event instanceof Events.ClassifiedAdSentForReview) {
      this.state = ClassifiedAd.ClassifiedAdState.PendingReview;
    }

    if (event instanceof Events.PictureAddedToAClassifiedAd) {
      const picture = new Picture(this.apply);
      this.applyToEntity(picture, event);
      this.pictures.push(picture);
    }
  }

  ensureValidState() {
    if (!this.id) {
      throw new InvalidEntityStateException(this, `Post-checked failed in state ${this.state}`);
    }

    if (!this.ownerId) {
      throw new InvalidEntityStateException(this, `Post-checked failed in state ${this.state}`);
    }

    if (this.state === ClassifiedAd.ClassifiedAdState.PendingReview) {
      if (!this.title || !this.text || !this.price || this.price.amount <= 0 || !this.firstPicture().hasCorrectSize()) {
        throw new InvalidEntityStateException(this, `Post checked failed in state ${this.state}`);
      }
    }

    if (this.state === ClassifiedAd.ClassifiedAdState.Active) {
      if (!this.title || !this.text || !this.price || this.price.amount <= 0 || !this.approvedBy || !this.firstPicture().hasCorrectSize()) {
        throw new InvalidEntityStateException(this, `Post checked failed in state ${this.state}`);
      }
    }
  }
}
