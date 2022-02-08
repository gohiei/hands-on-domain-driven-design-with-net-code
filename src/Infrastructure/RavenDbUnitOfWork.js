const IUnitOfWork = require('../Framework/IUnitOfWork');

module.exports = class RavenDbUnitOfWork extends IUnitOfWork {
  session;

  constructor(session) {
    super();

    this.session = session;
  }

  async commit() {
    await this.session.saveChanges();
  }
}
