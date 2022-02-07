const Value = require('../Framework/Value');

module.exports = class PictureSize extends Value {
  height = 0;
  width = 0;

  constructor(width, height) {
    super();

    if (width <= 0) {
      throw new RangeError('Picture width muse be a positive number');
    }

    if (height <= 0) {
      throw new RangeError('Picture height muse be a positive number');
    }

    this.width = width;
    this.height = height;
  }
}
