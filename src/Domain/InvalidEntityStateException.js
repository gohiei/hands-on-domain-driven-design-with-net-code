module.exports = class InvalidEntityStateException extends Error {
  constructor(entity, message) {
    super(`Entity ${entity.constructor.name} state change rejected, ${message}`);
  }
}
