import { BaseService } from '../../lib/base-classes';
import { ValidationError } from '../../lib/errors';
import { formatZodError } from '../../lib/utils/formatters';
import { QueueItemRepository } from './queue-item.repository';
import {
  createQueueItemDtoSchema,
  ICreateQueueItemDto,
  IUpdateQueueItemStatusDto,
  updateQueueItemStatusDtoSchema,
} from './types/dto.type';
import { IQueueItem, queueItemSchema } from './types/queue-item.type';

class QueueItemService extends BaseService {
  constructor(private readonly queueItemRepository: QueueItemRepository) {
    super('queue-item-service');
  }

  async create(createDto: ICreateQueueItemDto): Promise<IQueueItem['id']> {
    const isValid = createQueueItemDtoSchema.safeParse(createDto);

    if (!isValid.success) {
      const errorInstance = new ValidationError({
        details: {
          input: createDto,
          errors: formatZodError(isValid.error.issues),
        },
        context: 'create queue item',
      });

      this.logger.error(errorInstance);
      throw errorInstance;
    }

    const result = await this.queueItemRepository.create(createDto);

    return result;
  }

  async getById(
    id: IQueueItem['id'],
    queueId: IQueueItem['queueId']
  ): Promise<IQueueItem | undefined> {
    this.validateQueryItemId(id, 'update queue item status by id');
    this.validateQueryId(queueId, 'update queue item status by id');

    return this.queueItemRepository.getById(id, queueId);
  }

  async listAllByQueueId(
    queueId: IQueueItem['queueId'],
    status: IQueueItem['status'] = 'open'
  ): Promise<IQueueItem[] | undefined> {
    this.validateQueryId(queueId, 'list queue items by queue id');
    return this.queueItemRepository.listAllByQueueId(queueId, status);
  }

  async countAllByQueueId(
    queueId: IQueueItem['queueId'],
    status: IQueueItem['status'] = 'open'
  ): Promise<number> {
    this.validateQueryId(queueId, 'count queue items by queue id');
    return this.queueItemRepository.countAllByQueueId(queueId, status);
  }

  async updateItemStatusById(
    id: IQueueItem['id'],
    queueId: IQueueItem['queueId'],
    updateQueueItemStatus: IUpdateQueueItemStatusDto
  ): Promise<boolean> {
    this.validateQueryItemId(id, 'update queue item status by id');
    this.validateQueryId(queueId, 'update queue item status by id');

    const isDtoValid = updateQueueItemStatusDtoSchema.safeParse(
      updateQueueItemStatus
    );

    if (!isDtoValid.success) {
      const errorInstance = new ValidationError({
        details: {
          input: { id },
          errors: formatZodError(isDtoValid.error.issues),
        },
        context: 'update queue item status by id',
      });

      this.logger.error(errorInstance);
      throw errorInstance;
    }

    return this.queueItemRepository.updateItemStatusById(
      id,
      queueId,
      updateQueueItemStatus
    );
  }

  async deleteById(
    id: IQueueItem['id'],
    queueId: IQueueItem['queueId']
  ): Promise<boolean> {
    this.validateQueryItemId(id, 'update queue item status by id');
    this.validateQueryId(queueId, 'update queue item status by id');

    return this.queueItemRepository.deleteById(id, queueId);
  }

  private validateQueryItemId(id: unknown, context: string): void {
    const isIdValid = queueItemSchema.pick({ id: true }).safeParse({ id });

    if (!isIdValid.success) {
      const errorInstance = new ValidationError({
        details: {
          input: { id },
          errors: formatZodError(isIdValid.error.issues),
        },
        context,
      });

      this.logger.error(errorInstance);
      throw errorInstance;
    }
  }

  private validateQueryId(queueId: unknown, context: string): void {
    const isQueueIdValid = queueItemSchema
      .pick({ queueId: true })
      .safeParse({ queueId });

    if (!isQueueIdValid.success) {
      const errorInstance = new ValidationError({
        details: {
          input: { queueId },
          errors: formatZodError(isQueueIdValid.error.issues),
        },
        context,
      });

      this.logger.error(errorInstance);
      throw errorInstance;
    }
  }
}

export { QueueItemService };
