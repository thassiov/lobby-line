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
    internalConfigs.repository.sample.tableName,
    function (table) {
      table
        .uuid('id')
        .defaultTo(knex.fn.uuid())
        .primary()
        .unique()
        .index('sampleIdx');
      table.text('sampleProp').notNullable();
      table.timestamps(true, true);
    }
  );
  await knex.raw(onUpdateTrigger(internalConfigs.repository.sample.tableName));
}

async function down(knex: Knex) {
  await knex.raw(DROP_ON_UPDATE_TIMESTAMP_FUNCTION);
  await knex.schema.dropTable(internalConfigs.repository.sample.tableName);
}

const config = { transaction: false };

export { config, down, up };
