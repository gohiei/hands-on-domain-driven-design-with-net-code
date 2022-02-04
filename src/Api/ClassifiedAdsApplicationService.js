const IApplicationService = require('../Framework/IApplicationService');
const { ClassifiedAds: { v1 } } = require('../Contracts/index');
const { ClassifiedAd, ClassifiedAdId, UserId, ClassifiedAdTitle, ClassifiedAdText, Price } = require('../Domain');

module.exports = class ClassifiedAdsApplicationService extends IApplicationService {
  #repository;
  #currencyLookup;

  constructor(repository, currencyLookup) {
    super();

    this.#repository = repository;
    this.#currencyLookup = currencyLookup;
  }

  async handle(command) {
    if (command instanceof v1.Create) {
      this.handleCreate(command);
    }

    if (command instanceof v1.SetTitle) {
      this.handleUpdate(command, (classifiedAd) => {
        classifiedAd.setTitle(ClassifiedAdTitle.fromString(command.title));
      });
    }

    if (command instanceof v1.UpdateText) {
      this.handleUpdate(command, (classifiedAd) => {
        classifiedAd.updateText(ClassifiedAdText.fromString(command.text));
      });
    }

    if (command instanceof v1.UpdatePrice) {
      this.handleUpdate(command, (classifiedAd) => {
        classifiedAd.updatePrice(Price.fromDecimal(command.price, command.currency, this.#currencyLookup));
      });
    }

    if (command instanceof v1.RequestToPublish) {
      this.handleUpdate(command, (classifiedAd) => {
        classifiedAd.requestToPublish();
      });
    }

    console.log(command);
  }

  async handleCreate(command) {
    if (await this.#repository.exists(command.id)) {
      throw new Error(`Entity with id ${command.id} already exists`);
    }

    const classifiedAd = new ClassifiedAd(
      new ClassifiedAdId(command.id),
      new UserId(command.ownerId),
    );

    await this.#repository.save(classifiedAd);
  }

  async handleUpdate(command, operation) {
    const classifiedAd = await this.#repository.load(command.id);

    if (!classifiedAd) {
      throw new Error(`Entity with id ${command.id} cannot be found`);
    }

    await operation(classifiedAd);

    await this.#repository.save(classifiedAd);
  }
};
