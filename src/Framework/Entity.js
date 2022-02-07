const IInternalEventHandler = require('./IInternalEventHandler');

module.exports = class Entity extends IInternalEventHandler {
  applier;
  id;

  constructor(applier) {
    super();

    this.applier = applier;
  }

  apply(event) {
    this.when(event);
    this.applier(event);
  }

  when(event) {
    return;
  }

  handle(event) {
    this.when(event);
  }
}