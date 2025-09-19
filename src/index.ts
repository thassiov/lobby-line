import { queue } from './business';
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

  logger.info("Creating queue service's instance");
  const queueRepository = new queue.repository(databaseClient);
  const queueEventChannel = new queue.eventChannel(eventBrokerClient);
  const queueService = new queue.service(
    queueRepository,
    queueEventChannel
  );

  logger.info('Setting up queue service http endpoints');
  const queueEndpoints = queue.endpoint(queueService);

  logger.info('Starting http server');
  const startServer = setupExpressRestApi(
    queueEndpoints,
    internalConfigs.restApi
  );

  startServer();

  logger.info('Bootstrap process complete');
}

(() => {
  bootstrap();
})();
