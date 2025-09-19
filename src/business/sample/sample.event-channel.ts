import { Kafka } from 'kafkajs';
import { BaseEventChannel } from '../../lib/base-classes';

class QueueEventChannel extends BaseEventChannel {
  constructor(brokerClient: Kafka) {
    super('queue-event-channel', brokerClient);
  }
}

export { QueueEventChannel };
