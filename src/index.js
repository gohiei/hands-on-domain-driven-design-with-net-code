const Koa = require('koa');
const koaBody = require('koa-body');
const { SwaggerRouter } = require('koa-swagger-decorator');
const { DocumentStore } = require('ravendb');
const winston = require('winston');
const FixedCurrencyLookup = require('./FixedCurrencyLookup');
const ClassifiedAdRepository = require('./Infrastructure/ClassifiedAdRepository');
const RavenDbUnitOfWork = require('./Infrastructure/RavenDbUnitOfWork');
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

async function configureServices(app) {
  const store = initRavenDb(app);
  const logger = initLogger(app);

  const session = await store.openSession();

  const currencyLookup = new FixedCurrencyLookup();
  const classifiedAdRepository = new ClassifiedAdRepository(session);
  const ravenDbUnitOfWork = new RavenDbUnitOfWork(session);
  const classifiedAdApplicationService = new ClassifiedAdsApplicationService(
    classifiedAdRepository,
    ravenDbUnitOfWork,
    currencyLookup
  );

  // new ClassifiedAdsCommandsApi(classifiedAdApplicationService);
  app.context.classifiedAdApplicationService = classifiedAdApplicationService;
  app.context.logger = logger;
}

function initRavenDb(app) {
  const store = new DocumentStore('http://localhost:3991', 'Marketplace_Chapter8');
  store.conventions.identityProperty = 'DbId';
  store.initialize();

  return store;
}

function initLogger(app) {
  const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
      new winston.transports.Console(),
    ],
  });

  app.use(async (ctx, next) => {
    try {
      const uri = `${ctx.method} ${ctx.path}`;
      logger.info(`Handling HTTP request "${uri}"`);

      await next();
    } catch (err) {
      logger.error('Error handling the request', err);
      ctx.throw(400, err);
    }
  });

  return logger;
}
