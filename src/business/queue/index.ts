import { makeServiceEndpoints } from './queue.endpoint';
import { QueueRepository } from './queue.repository';
import { QueueService } from './queue.service';

const queue = {
  service: QueueService,
  repository: QueueRepository,
  endpoint: makeServiceEndpoints,
};

export { queue };
