import { Kafka } from 'kafkajs';
import { EventBrokerConfig } from '../../../../lib/types';

function getEventBrokerClient(eventBrokerConfig: EventBrokerConfig): Kafka {
  const broker = new Kafka({
    clientId: eventBrokerConfig.clientId,
    brokers: eventBrokerConfig.brokers,
  });

  return broker;
}

export { getEventBrokerClient };
