import { Knex } from 'knex';
import { internalConfigs } from '../../../../lib/config';

// [ https://stackoverflow.com/a/48028011/931704 ]
const ON_UPDATE_TIMESTAMP_FUNCTION = `
  CREATE OR REPLACE FUNCTION on_update_timestamp()
  RETURNS trigger AS $$
  BEGIN
    NEW.updated_at = now();
    RETURN NEW;
  END;
$$ language 'plpgsql';
`;

// must be set with/after the `createTable` calls so we can use the `updatedAt` timestamp
function onUpdateTrigger(table: string) {
  return `
    CREATE TRIGGER ${table}_updated_at
    BEFORE UPDATE ON ${table}
    FOR EACH ROW
    EXECUTE PROCEDURE on_update_timestamp();
  `;
}

const DROP_ON_UPDATE_TIMESTAMP_FUNCTION = `DROP FUNCTION on_update_timestamp`;

async function up(knex: Knex) {
  // fixes the updated_at timestamp problem that postgres does not update by adding a new function
  await knex.raw(ON_UPDATE_TIMESTAMP_FUNCTION);

  await knex.schema.createTable(
    internalConfigs.repository.queue.tableName,
    function (table) {
      table
        .uuid('id')
        .defaultTo(knex.fn.uuid())
        .primary()
        .unique()
        .index('queueIdx');
      table.string('name').notNullable();
      table.timestamps(true, true);
    }
  );
  await knex.raw(onUpdateTrigger(internalConfigs.repository.queue.tableName));

  await knex.schema.createTable(
    internalConfigs.repository.queueItem.tableName,
    function (table) {
      table
        .uuid('id')
        .defaultTo(knex.fn.uuid())
        .primary()
        .unique()
        .index('queueItemIdx');
      table.uuid('queueId');
      table.enum('status', ['open', 'closed']).notNullable().defaultTo('open');
      table.integer('priority').notNullable().defaultTo(5);
      table.jsonb('meta');
      table.timestamps(true, true);
      table.index(['queueId', 'status'], 'statusInQueueIdx');
      table
        .foreign('queueId')
        .references('id')
        .inTable(internalConfigs.repository.queue.tableName)
        .onDelete('CASCADE');
    }
  );
  // @NOTE: the argument for onUpdateTrigger is a string because it has to be snake cased. I'll fix this later
  //  so we can set it directly as the value from the `internalConfigs` record (which is camel cased).
  await knex.raw(onUpdateTrigger('queue_item'));
}

async function down(knex: Knex) {
  await knex.raw(DROP_ON_UPDATE_TIMESTAMP_FUNCTION);
  await knex.schema.dropTable(internalConfigs.repository.queue.tableName);
  await knex.schema.dropTable(internalConfigs.repository.queueItem.tableName);
}

const config = { transaction: false };

export { config, down, up };
