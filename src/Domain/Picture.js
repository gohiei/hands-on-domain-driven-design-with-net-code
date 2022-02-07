const Entity = require('../Framework/Entity');
const PictureId = require('./PictureId');
const PictureSize = require('./PictureSize');
const Uri = require('./Uri');
const Events = require('./Events');

module.exports = class Picture extends Entity {
  id;
  size;
  location;
  order;

  constructor(applier) {
    super(applier);
  }

  when(event) {
    if (event instanceof Events.PictureAddedToAClassifiedAd) {
      this.id = new PictureId(event.pictureId);
      this.size = new PictureSize(event.width, event.height);
      this.location = new Uri(event.url);
      this.order = event.order;
    }

    if (event instanceof Events.ClassifiedAdPictureResized) {
      this.size = new PictureSize(event.width, event.height);
    }
  }

  resize(newSize) {
    assert(newSize instanceof PictureSize);

    this.apply(new Events.ClassifiedAdPictureResized({
      pictureId: this.id,
      height: newSize.height,
      width: newSize.width,
    }));
  }

  hasCorrectSize() {
    const picture = this;

    return !!picture && picture.size.width >= 800 && picture.size.height >= 600;
  }
};
