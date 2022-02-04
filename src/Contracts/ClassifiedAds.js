const ClassifiedAds = {
  v1: {
    Create: class {
      constructor({ id, ownerId }) {
        this.id = id;
        this.ownerId = ownerId;
      }
    },

    SetTitle: class {
      constructor({ id, title }) {
        this.id = id;
        this.title = title;
      }
    },

    UpdateText: class {
      constructor({ id, text }) {
        this.id = id;
        this.text = text;
      }
    },

    UpdatePrice: class {
      constructor({ id, price, currency }) {
        this.id = id;
        this.price = price;
        this.currency = currency;
      }
    },

    RequestToPublish: class {
      constructor({ id }) {
        this.id = id;
      }
    }
  }
};

module.exports = ClassifiedAds;
