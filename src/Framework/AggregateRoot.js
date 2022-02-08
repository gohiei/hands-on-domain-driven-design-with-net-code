const assert = require('assert');
const IInternalEventHandler = require('./IInternalEventHandler');

module.exports = class AggregateRoot extends IInternalEventHandler {
  #changes = [];

  when(event) {}
  ensureValidState() {}

  apply(event) {
    this.when(event);
    this.ensureValidState();
    this.#changes.push(event);
  }

  getChanges() {
    return this.#changes;
  }

  clearChanges() {
    this.#changes = [];
  }

  applyToEntity(entity, event) {
    assert(entity instanceof IInternalEventHandler);

    entity && entity.handle(event);
  }

  handle(event) {
    this.when(event);
  }
};
