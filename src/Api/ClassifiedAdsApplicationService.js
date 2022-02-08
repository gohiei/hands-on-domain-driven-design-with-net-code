const IApplicationService = require('../Framework/IApplicationService');
const { ClassifiedAds: { v1 } } = require('../Contracts/index');
const { ClassifiedAd, ClassifiedAdId, UserId, ClassifiedAdTitle, ClassifiedAdText, Price } = require('../Domain');
const ClassifiedAdDto = require('../Infrastructure/ClassifiedAdDto');

module.exports = class ClassifiedAdsApplicationService extends IApplicationService {
  #repository;
  #unitOfWork;
  #currencyLookup;

  constructor(repository, unitOfWork, currencyLookup) {
    super();

    this.#repository = repository;
    this.#unitOfWork = unitOfWork;
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
  }

  async handleCreate(command) {
    if (await this.#repository.exists(command.id)) {
      throw new Error(`Entity with id ${command.id} already exists`);
    }

    const classifiedAd = new ClassifiedAd(
      new ClassifiedAdId(command.id),
      new UserId(command.ownerId),
    );

    const classifiedAdData = ClassifiedAdDto.toData(classifiedAd);

    await this.#repository.add(classifiedAdData);
    await this.#unitOfWork.commit();
  }

  async handleUpdate(command, operation) {
    const classifiedAdData = await this.#repository.load(command.id);

    if (!classifiedAdData) {
      throw new Error(`Entity with id ${command.id} cannot be found`);
    }

    const classifiedAd = ClassifiedAdDto.toDomainEntity(classifiedAdData, this.#currencyLookup);

    await operation(classifiedAd);

    ClassifiedAdDto.toData(classifiedAd, classifiedAdData);

    await this.#unitOfWork.commit();
  }
};
