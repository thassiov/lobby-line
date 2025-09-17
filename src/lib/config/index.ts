const database = {
  host: 'db',
  port: '5432',
  user: 'sample',
  database: 'sample',
  password: 'sample',
};

const eventBroker = {
  clientId: 'sample',
  brokers: ['broker:9092'],
};

const restApi = {
  port: 8080,
};

const repository = {
  sample: {
    tableName: 'sample',
  },
};

const internalConfigs = {
  repository,
  database,
  eventBroker,
  restApi,
};

export { internalConfigs };
