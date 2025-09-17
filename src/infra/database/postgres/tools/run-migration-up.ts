import { internalConfigs } from '../../../../lib/config';
import { setupLogger } from '../../../../lib/logger/logger';
import { getDatabaseClient } from '../lib/connection-client';

const logger = setupLogger('migration-up-tool');

async function runMigrationUp() {
  logger.info('starting migration up script');

  const dbClient = getDatabaseClient(internalConfigs.database);

  await dbClient.migrate.up();
}

(async () => {
  await runMigrationUp();
  process.exit(0);
})().catch(logger.error);
