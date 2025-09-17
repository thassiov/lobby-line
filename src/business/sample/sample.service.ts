import { KafkaMessage } from 'kafkajs';
import { BaseService } from '../../lib/base-classes';
import { ValidationError } from '../../lib/errors';
import { formatZodError } from '../../lib/utils/formatters';
import { SampleEventChannel } from './sample.event-channel';
import { SampleRepository } from './sample.repository';
import {
  createSampleDtoSchema,
  ICreateSampleDto,
  IUpdateSampleDto,
  updateSampleDtoSchema,
} from './types/dto.type';
import { ISample, sampleSchema } from './types/sample.type';

class SampleService extends BaseService {
  constructor(
    private readonly sampleRepository: SampleRepository,
    private readonly sampleEventChannel: SampleEventChannel
  ) {
    super('sample-service');
  }

  async create(createDto: ICreateSampleDto): Promise<ISample['id']> {
    const isValid = createSampleDtoSchema.safeParse(createDto);

    if (!isValid.success) {
      const errorInstance = new ValidationError({
        details: {
          input: createDto,
          errors: formatZodError(isValid.error.issues),
        },
        context: 'create sample',
      });

      this.logger.error(errorInstance);
      throw errorInstance;
    }

    const result = await this.sampleRepository.create(createDto);

    await this.sampleEventChannel.sendMessageToTopic('create-sample', [
      { key: result, value: createDto.sampleProp },
    ]);

    return result;
  }

  async getById(id: ISample['id']): Promise<ISample | undefined> {
    const isValid = sampleSchema.pick({ id: true }).safeParse({ id });

    if (!isValid.success) {
      const errorInstance = new ValidationError({
        details: {
          input: { id },
          errors: formatZodError(isValid.error.issues),
        },
        context: 'get sample by id',
      });

      this.logger.error(errorInstance);
      throw errorInstance;
    }

    return this.sampleRepository.getById(id);
  }

  async updateById(
    id: ISample['id'],
    updateSampleDto: IUpdateSampleDto
  ): Promise<boolean> {
    const isIdValid = sampleSchema.pick({ id: true }).safeParse({ id });

    if (!isIdValid.success) {
      const errorInstance = new ValidationError({
        details: {
          input: { id },
          errors: formatZodError(isIdValid.error.issues),
        },
        context: 'update sample by id: id is invalid',
      });

      this.logger.error(errorInstance);
      throw errorInstance;
    }

    const isDtoValid = updateSampleDtoSchema.safeParse(updateSampleDto);

    if (!isDtoValid.success) {
      const errorInstance = new ValidationError({
        details: {
          input: { id },
          errors: formatZodError(isDtoValid.error.issues),
        },
        context: 'update sample by id: dto is invalid',
      });

      this.logger.error(errorInstance);
      throw errorInstance;
    }

    return this.sampleRepository.updateById(id, updateSampleDto);
  }

  async deleteById(id: ISample['id']): Promise<boolean> {
    const isValid = sampleSchema.pick({ id: true }).safeParse({ id });

    if (!isValid.success) {
      const errorInstance = new ValidationError({
        details: {
          input: { id },
          errors: formatZodError(isValid.error.issues),
        },
        context: 'delete sample by id',
      });

      this.logger.error(errorInstance);
      throw errorInstance;
    }

    return this.sampleRepository.deleteById(id);
  }

  async consumeMessagesFromTopic(topic: string): Promise<void> {
    const handler = async function topicHandler({
      message,
    }: {
      message: KafkaMessage;
    }): Promise<void> {
      await Promise.resolve(message);
    };

    await this.sampleEventChannel.consumeFromTopic(topic, handler);
  }
}

export { SampleService };
