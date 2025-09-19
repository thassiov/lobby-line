import { Knex } from 'knex';
import { IInsertReturningId } from '../../infra/database/postgres/types';
import { BaseRepository } from '../../lib/base-classes';
import { internalConfigs } from '../../lib/config';
import { NotFoundError, UnexpectedError } from '../../lib/errors';
import { BaseCustomError } from '../../lib/errors/base-custom-error.error';
import {
  ICreateQueueItemDto,
  IUpdateQueueItemStatusDto,
} from './types/dto.type';
import { IQueueItem } from './types/queue-item.type';

class QueueItemRepository extends BaseRepository {
  private tableName: string;
  constructor(private readonly dbClient: Knex) {
    super('queue-item-repository');
    this.tableName = internalConfigs.repository.queueItem.tableName;
  }

  async create(createDto: ICreateQueueItemDto): Promise<IQueueItem['id']> {
    try {
      const [result] = await this.sendInsertReturningIdQuery(createDto);

      if (!result) {
        const errorInstance = new UnexpectedError({
          context: 'create queue item',
          details: {
            input: createDto,
            message: 'database insert operation did not return an id',
          },
        });

        this.logger.error(errorInstance);
        throw errorInstance;
      }

      return result.id;
    } catch (error) {
      if (error instanceof BaseCustomError) {
        throw error;
      }

      const errorInstance = new UnexpectedError({
        cause: error as Error,
        context: 'create queue item',
        details: {
          input: createDto,
        },
      });

      this.logger.error(errorInstance);
      throw errorInstance;
    }
  }

  async getById(
    id: IQueueItem['id'],
    queueId: IQueueItem['queueId']
  ): Promise<IQueueItem | undefined> {
    try {
      return await this.sendFindByIdQuery(id, queueId);
    } catch (error) {
      const repositoryError = new UnexpectedError({
        cause: error as Error,
        context: 'get queue item by id',
        details: {
          input: { id, queueId },
        },
      });

      throw repositoryError;
    }
  }

  async listAllByQueueId(
    queueId: IQueueItem['queueId'],
    status: IQueueItem['status'] = 'open'
  ): Promise<IQueueItem[] | undefined> {
    try {
      return await this.sendGetAllByQueueIdQuery(queueId, status);
    } catch (error) {
      const repositoryError = new UnexpectedError({
        cause: error as Error,
        context: 'list queue items',
        details: {
          queueId,
          status,
        },
      });

      throw repositoryError;
    }
  }

  async countAllByQueueId(
    queueId: IQueueItem['queueId'],
    status: IQueueItem['status'] = 'open'
  ): Promise<number> {
    try {
      return await this.sendCountAllByQueueIdQuery(queueId, status);
    } catch (error) {
      const repositoryError = new UnexpectedError({
        cause: error as Error,
        context: 'counting queue items',
        details: {
          queueId,
          status,
        },
      });

      throw repositoryError;
    }
  }

  async updateItemStatusById(
    id: IQueueItem['id'],
    queueId: IQueueItem['queueId'],
    updateQueueItemStatus: IUpdateQueueItemStatusDto
  ): Promise<boolean> {
    try {
      const result = await this.sendUpdateItemStatusByIdQuery(
        id,
        queueId,
        updateQueueItemStatus
      );

      if (result === 0) {
        const errorInstance = new NotFoundError({
          context: 'update queue item status by id',
          details: {
            input: { id, queueId, ...updateQueueItemStatus },
          },
        });

        this.logger.error(errorInstance);
        throw errorInstance;
      }

      return true;
    } catch (error) {
      if (error instanceof BaseCustomError) {
        throw error;
      }

      const errorInstance = new UnexpectedError({
        cause: error as Error,
        context: 'update queue item status by id',
        details: {
          input: { id, queueId, ...updateQueueItemStatus },
        },
      });

      this.logger.error(errorInstance);
      throw errorInstance;
    }
  }

  async updateOldestQueueItemStatusByQueueId(
    queueId: IQueueItem['queueId'],
    updateQueueItemStatus: IUpdateQueueItemStatusDto
  ): Promise<boolean> {
    try {
      const result = await this.sendUpdateOldestQueueItemStatusByQueueIdQuery(
        queueId,
        updateQueueItemStatus
      );

      if (result === 0) {
        const errorInstance = new NotFoundError({
          context: 'update latest queue item status by id',
          details: {
            input: { queueId, ...updateQueueItemStatus },
          },
        });

        this.logger.error(errorInstance);
        throw errorInstance;
      }

      return true;
    } catch (error) {
      if (error instanceof BaseCustomError) {
        throw error;
      }

      const errorInstance = new UnexpectedError({
        cause: error as Error,
        context: 'update latest queue item status by id',
        details: {
          input: { queueId, ...updateQueueItemStatus },
        },
      });

      this.logger.error(errorInstance);
      throw errorInstance;
    }
  }

  async deleteById(
    id: IQueueItem['id'],
    queueId: IQueueItem['queueId']
  ): Promise<boolean> {
    try {
      const result = await this.sendDeleteByIdQuery(id, queueId);

      if (result === 0) {
        throw new NotFoundError({
          context: 'delete queueItem by id',
          details: {
            input: { id, queueId },
          },
        });
      }

      return true;
    } catch (error) {
      if (error instanceof BaseCustomError) {
        throw error;
      }

      const repositoryError = new UnexpectedError({
        cause: error as Error,
        context: 'delete queue item by id',
        details: {
          input: { id, queueId },
        },
      });

      throw repositoryError;
    }
  }

  private async sendInsertReturningIdQuery(
    payload: ICreateQueueItemDto
  ): Promise<IInsertReturningId> {
    const query = this.dbClient
      .insert(payload)
      .into(this.tableName)
      .returning<IInsertReturningId>('id');

    return await query;
  }

  private async sendFindByIdQuery(
    id: IQueueItem['id'],
    queueId: IQueueItem['queueId']
  ): Promise<IQueueItem | undefined> {
    return this.dbClient<IQueueItem>(this.tableName)
      .where({ id, queueId })
      .first();
  }

  private async sendGetAllByQueueIdQuery(
    queueId: IQueueItem['queueId'],
    status: IQueueItem['status'] = 'open'
  ): Promise<IQueueItem[] | undefined> {
    return this.dbClient<IQueueItem>(this.tableName)
      .where({ queueId, status })
      .select('*');
  }

  private async sendCountAllByQueueIdQuery(
    queueId: IQueueItem['queueId'],
    status: IQueueItem['status'] = 'open'
  ): Promise<number> {
    const [result] = (await this.dbClient<IQueueItem>(this.tableName)
      .where({ queueId, status })
      .count('*')) as { count: number }[];
    return result!.count;
  }

  private async sendUpdateItemStatusByIdQuery(
    id: IQueueItem['id'],
    queueId: IQueueItem['queueId'],
    updateQueueItemStatus: IUpdateQueueItemStatusDto
  ): Promise<number> {
    return await this.dbClient(this.tableName)
      .where({ id, queueId, status: 'open' })
      .update(updateQueueItemStatus);
  }

  private async sendUpdateOldestQueueItemStatusByQueueIdQuery(
    queueId: IQueueItem['queueId'],
    updateQueueItemStatus: IUpdateQueueItemStatusDto
  ): Promise<number> {
    return this.dbClient.transaction(async (trx) => {
      return trx(this.tableName)
        .update(updateQueueItemStatus)
        .where(
          'id',
          trx(this.tableName)
            .select('id')
            .where({ queueId, status: 'open' })
            .orderBy([
              { column: 'createdAt', order: 'asc' },
              { column: 'id', order: 'asc' },
            ])
            .limit(1)
            .forUpdate()
            .skipLocked()
        );
    });
  }

  private async sendDeleteByIdQuery(
    id: IQueueItem['id'],
    queueId: IQueueItem['queueId']
  ): Promise<number> {
    return await this.dbClient(this.tableName).where({ id, queueId }).del();
  }
}

export { QueueItemRepository };
