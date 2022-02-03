module.exports = class ClassifiedAdId {
  id;

  constructor(id) {
    if (id === undefined) {
      throw new Error('Classified Ad id cannot be empty');
    }

    this.id = id;
  }
}
