import knex, { Knex } from 'knex';
import knexStringcase from 'knex-stringcase';
import path from 'path';
import { DatabaseConfig } from '../../../../lib/types';

function getDatabaseClient(databaseConfig: DatabaseConfig): Knex {
  const migrationsDir = path.resolve(__dirname, '../migrations');

  const opts = {
    ...knexStringcase(),
    client: 'pg',
    migrations: {
      directory: migrationsDir,
      tableName: 'migrations',
      extension: 'ts',
    },
    connection: {
      ...databaseConfig,
    },
  };

  const client = knex(opts);

  return client;
}

export { getDatabaseClient };
