import { makeServiceEndpoints } from './queue.endpoint';
import { QueueEventChannel } from './queue.event-channel';
import { QueueRepository } from './queue.repository';
import { QueueService } from './queue.service';

const queue = {
  service: QueueService,
  repository: QueueRepository,
  endpoint: makeServiceEndpoints,
  eventChannel: QueueEventChannel,
};

export { queue };
