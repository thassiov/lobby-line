import { Kafka } from 'kafkajs';
import { BaseEventChannel } from '../../lib/base-classes';

class SampleEventChannel extends BaseEventChannel {
  constructor(brokerClient: Kafka) {
    super('sample-event-channel', brokerClient);
  }
}

export { SampleEventChannel };
