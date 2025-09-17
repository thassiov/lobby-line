import { makeServiceEndpoints } from './sample.endpoint';
import { SampleEventChannel } from './sample.event-channel';
import { SampleRepository } from './sample.repository';
import { SampleService } from './sample.service';

const sample = {
  service: SampleService,
  repository: SampleRepository,
  endpoint: makeServiceEndpoints,
  eventChannel: SampleEventChannel,
};

export { sample };
