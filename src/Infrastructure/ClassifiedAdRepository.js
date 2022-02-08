const IClassifiedAdRepository = require('../Domain/IClassifiedAdRepository');

module.exports = class ClassifiedAdRepository extends IClassifiedAdRepository {
  session;

  constructor(session) {
    super();

    this.session = session;
  }

  async add(entity) {
    await this.session.store(
      entity,
      ClassifiedAdRepository.EntityId(entity.id),
    );
  }

  async exists(id) {
    return await this.session.exists(ClassifiedAdRepository.EntityId(id));
  }

  async load(id) {
    return await this.session.load(ClassifiedAdRepository.EntityId(id));
  }

  static EntityId(id) {
    return `ClassifiedAd/${id.toString()}`;
  }
}
