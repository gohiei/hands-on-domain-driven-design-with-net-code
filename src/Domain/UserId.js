module.exports = class UserId {
  id;

  constructor(id) {
    if (id === undefined) {
      throw new Error('User id cannot be empty');
    }

    this.id = id;
  }
}
