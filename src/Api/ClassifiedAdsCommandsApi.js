const { request, summary, query, path, body, tags } = require('koa-swagger-decorator');
const { ClassifiedAds: { v1 } } = require('../Contracts/index');
module.exports = class ClassifiedAdsCommandsApi {
  constructor(ctx) {
    // @todo use application service is better than DI
    this.applicationService = ctx.classifiedAdApplicationService;
  }

  @request('post', '/ad')
  @summary('Create a classified ad')
  @body({ id: { type: 'string', required: true }, ownerId: { type: 'string', required: true } })
  async create(ctx) {
    const { id, ownerId } = ctx.request.body;

    const contract = new v1.Create({
      id, ownerId,
    });

    this.applicationService.handle(contract);

    ctx.body = 'ok';
  }

  @request('put', '/name')
  @summary('Set title of classified ad')
  @body({ id: { type: 'string', required: true }, title: { type: 'string', required: true } })
  async setTitle(ctx) {
    const { id, title } = ctx.request.body;

    const contract = new v1.SetTitle({
      id, title,
    });

    this.applicationService.handle(contract);

    ctx.body = 'ok';
  }

  @request('put', '/text')
  @summary('Update text of classified ad')
  @body({ id: { type: 'string', required: true }, text: { type: 'string', required: true } })
  async updateText(ctx) {
    const { id, text } = ctx.request.body;

    const contract = new v1.UpdateText({
      id, text,
    });

    this.applicationService.handle(contract);

    ctx.body = 'ok';
  }

  @request('put', '/price')
  @summary('Update price of classified ad')
  @body({
    id: { type: 'string', required: true },
    price: { type: 'decimal', required: true },
    currency: { type: 'string', required: true }
  })
  async updatePrice(ctx) {
    const { id, price, currency } = ctx.request.body;

    const contract = new v1.UpdatePrice({
      id, currency, price
    });

    this.applicationService.handle(contract);

    ctx.body = 'ok';
  }

  @request('put', '/publish')
  @summary('Request a classified ad to publish')
  @body({ id: { type: 'string', required: true } })
  async requestToPublish(ctx) {
    const { id } = ctx.request.body;

    const contract = new v1.UpdatePrice({
      id
    });

    this.applicationService.handle(contract);

    ctx.body = 'ok';
  }
}
