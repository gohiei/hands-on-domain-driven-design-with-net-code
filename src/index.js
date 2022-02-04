const Koa = require('koa');
const koaBody = require('koa-body');
const { SwaggerRouter } = require('koa-swagger-decorator');
const FixedCurrencyLookup = require('./FixedCurrencyLookup');
const ClassifiedAdRepository = require('./ClassifiedAdRepository');
const ClassifiedAdsApplicationService = require('./Api/ClassifiedAdsApplicationService');

bootstrap();

function bootstrap() {
  const app = new Koa();

  configureServices(app);

  const router = new SwaggerRouter();

  router.swagger({
    title: 'API V2 Server',
    description: 'API DOC',
    version: '1.0.0'
  });
  router.mapDir(__dirname + '/Api');

  app
    .use(koaBody())
    .use(router.routes())
    .use(router.allowedMethods());

  console.debug(`Environment: ${app.env}`);

  app.listen(3091);
}

function configureServices(app) {
  const currencyLookup = new FixedCurrencyLookup();
  const classifiedAdRepository = new ClassifiedAdRepository();
  const classifiedAdApplicationService = new ClassifiedAdsApplicationService(classifiedAdRepository, currencyLookup);

  // new ClassifiedAdsCommandsApi(classifiedAdApplicationService);
  app.context.classifiedAdApplicationService = classifiedAdApplicationService;
}
