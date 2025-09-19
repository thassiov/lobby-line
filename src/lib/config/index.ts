const database = {
  host: 'db',
  port: '5432',
  user: 'queue',
  database: 'queue',
  password: 'queue',
};

const eventBroker = {
  clientId: 'queue',
  brokers: ['broker:9092'],
};

const restApi = {
  port: 8080,
};

const repository = {
  queue: {
    tableName: 'queue',
  },
};

const internalConfigs = {
  repository,
  database,
  eventBroker,
  restApi,
};

export { internalConfigs };
