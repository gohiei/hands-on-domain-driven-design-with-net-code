const Events = {
  ClassifiedAdCreated: class {
    constructor({ id, ownerId }) {
      this.id = id;
      this.ownerId = ownerId;
    }
  },

  ClassifiedAdTitleChanged: class {
    constructor({ id, title }) {
      this.id = id;
      this.title = title;
    }
  },

  ClassifiedAdTextUpdated: class {
    constructor({ id, text }) {
      this.id = id;
      this.text = text;
    }
  },

  ClassifiedAdPriceUpdated: class {
    constructor({ id, price, currencyCode }) {
      this.id = id;
      this.price = price;
      this.currencyCode = currencyCode;
    }
  },

  ClassifiedAdSentForReview: class {
    constructor({ id }) {
      this.id = id;
    }
  }
}

module.exports = Events;
