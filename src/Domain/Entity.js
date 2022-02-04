module.exports = class Entity {
  events = [];

  apply(event) {
    this.when(event);
    this.ensureValidState();
    this.events.push(event);
  }

  ensureValidState() {
    return;
  }

  when(event) {
    return;
  }

  raise(event) {
    this.events.push(event);
  }

  getChanged() {
    return this.events;
  }

  clearChanges() {
    this.events.splice(0);
  }
}