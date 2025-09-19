import { BaseService } from '../../lib/base-classes';
import { ValidationError } from '../../lib/errors';
import { formatZodError } from '../../lib/utils/formatters';
import { QueueRepository } from './queue.repository';
import {
  createQueueDtoSchema,
  ICreateQueueDto,
  IUpdateQueueDto,
  updateQueueDtoSchema,
} from './types/dto.type';
import { IQueue, queueSchema } from './types/queue.type';

class QueueService extends BaseService {
  constructor(private readonly queueRepository: QueueRepository) {
    super('queue-service');
  }

  async create(createDto: ICreateQueueDto): Promise<IQueue['id']> {
    const isValid = createQueueDtoSchema.safeParse(createDto);

    if (!isValid.success) {
      const errorInstance = new ValidationError({
        details: {
          input: createDto,
          errors: formatZodError(isValid.error.issues),
        },
        context: 'create queue',
      });

      this.logger.error(errorInstance);
      throw errorInstance;
    }

    const result = await this.queueRepository.create(createDto);

    return result;
  }

  async getById(id: IQueue['id']): Promise<IQueue | undefined> {
    const isValid = queueSchema.pick({ id: true }).safeParse({ id });

    if (!isValid.success) {
      const errorInstance = new ValidationError({
        details: {
          input: { id },
          errors: formatZodError(isValid.error.issues),
        },
        context: 'get queue by id',
      });

      this.logger.error(errorInstance);
      throw errorInstance;
    }

    return this.queueRepository.getById(id);
  }

  async updateById(
    id: IQueue['id'],
    updateQueueDto: IUpdateQueueDto
  ): Promise<boolean> {
    const isIdValid = queueSchema.pick({ id: true }).safeParse({ id });

    if (!isIdValid.success) {
      const errorInstance = new ValidationError({
        details: {
          input: { id },
          errors: formatZodError(isIdValid.error.issues),
        },
        context: 'update queue by id: id is invalid',
      });

      this.logger.error(errorInstance);
      throw errorInstance;
    }

    const isDtoValid = updateQueueDtoSchema.safeParse(updateQueueDto);

    if (!isDtoValid.success) {
      const errorInstance = new ValidationError({
        details: {
          input: { id },
          errors: formatZodError(isDtoValid.error.issues),
        },
        context: 'update queue by id: dto is invalid',
      });

      this.logger.error(errorInstance);
      throw errorInstance;
    }

    return this.queueRepository.updateById(id, updateQueueDto);
  }

  async deleteById(id: IQueue['id']): Promise<boolean> {
    const isValid = queueSchema.pick({ id: true }).safeParse({ id });

    if (!isValid.success) {
      const errorInstance = new ValidationError({
        details: {
          input: { id },
          errors: formatZodError(isValid.error.issues),
        },
        context: 'delete queue by id',
      });

      this.logger.error(errorInstance);
      throw errorInstance;
    }

    return this.queueRepository.deleteById(id);
  }
}

export { QueueService };
