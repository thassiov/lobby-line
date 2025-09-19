import { makeServiceEndpoints } from './queue-item.endpoint';
import { QueueItemRepository } from './queue-item.repository';
import { QueueItemService } from './queue-item.service';

const queueItem = {
  service: QueueItemService,
  repository: QueueItemRepository,
  endpoint: makeServiceEndpoints,
};

export { queueItem };
