import { sample } from './business';
import { getDatabaseClient } from './infra/database/postgres/lib/connection-client';
import { getEventBrokerClient } from './infra/event-broker/kafka/lib/connection-client';
import { setupExpressRestApi } from './infra/rest-api/express';
import { internalConfigs } from './lib/config';
import { setupLogger } from './lib/logger';

const logger = setupLogger('bootstrap');

function bootstrap() {
  logger.info('Starting bootstrap process');

  logger.info('Fetching databaseClient');
  const databaseClient = getDatabaseClient(internalConfigs.database);

  logger.info('Fetching eventBrokerClient');
  const eventBrokerClient = getEventBrokerClient(internalConfigs.eventBroker);

  logger.info("Creating sample service's instance");
  const sampleRepository = new sample.repository(databaseClient);
  const sampleEventChannel = new sample.eventChannel(eventBrokerClient);
  const sampleService = new sample.service(
    sampleRepository,
    sampleEventChannel
  );

  logger.info('Setting up sample service http endpoints');
  const sampleEndpoints = sample.endpoint(sampleService);

  logger.info('Starting http server');
  const startServer = setupExpressRestApi(
    sampleEndpoints,
    internalConfigs.restApi
  );

  startServer();

  logger.info('Bootstrap process complete');
}

(() => {
  bootstrap();
})();
