import { Knex } from 'knex';
import { IInsertReturningId } from '../../infra/database/postgres/types';
import { BaseRepository } from '../../lib/base-classes';
import { internalConfigs } from '../../lib/config';
import { NotFoundError, UnexpectedError } from '../../lib/errors';
import { BaseCustomError } from '../../lib/errors/base-custom-error.error';
import { ICreateQueueDto, IUpdateQueueDto } from './types/dto.type';
import { IQueue } from './types/queue.type';

class QueueRepository extends BaseRepository {
  private tableName: string;
  constructor(private readonly dbClient: Knex) {
    super('queue-repository');
    this.tableName = internalConfigs.repository.queue.tableName;
  }

  async create(createDto: ICreateQueueDto): Promise<IQueue['id']> {
    try {
      const [result] = await this.sendInsertReturningIdQuery(createDto);

      if (!result) {
        const errorInstance = new UnexpectedError({
          context: 'create queue',
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
        context: 'create queue',
        details: {
          input: createDto,
        },
      });

      this.logger.error(errorInstance);
      throw errorInstance;
    }
  }

  async getById(id: IQueue['id']): Promise<IQueue | undefined> {
    try {
      return await this.sendFindByIdQuery(id);
    } catch (error) {
      const repositoryError = new UnexpectedError({
        cause: error as Error,
        context: 'get queue by id',
        details: {
          input: { id },
        },
      });

      throw repositoryError;
    }
  }

  async listAll(): Promise<IQueue[] | undefined> {
    try {
      return await this.sendGetAllQuery();
    } catch (error) {
      const repositoryError = new UnexpectedError({
        cause: error as Error,
        context: 'list queues',
        details: {},
      });

      throw repositoryError;
    }
  }

  async countAll(): Promise<number> {
    try {
      return await this.sendCountAllQuery();
    } catch (error) {
      const repositoryError = new UnexpectedError({
        cause: error as Error,
        context: 'counting queues',
        details: {},
      });

      throw repositoryError;
    }
  }

  async updateById(
    id: IQueue['id'],
    updateQueueDto: IUpdateQueueDto
  ): Promise<boolean> {
    try {
      const result = await this.sendUpdateByIdQuery(id, updateQueueDto);

      if (result === 0) {
        const errorInstance = new NotFoundError({
          context: 'update queue by id',
          details: {
            input: { id, ...updateQueueDto },
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
        context: 'update queue by id',
        details: {
          input: { id, ...updateQueueDto },
        },
      });

      this.logger.error(errorInstance);
      throw errorInstance;
    }
  }

  async deleteById(id: IQueue['id']): Promise<boolean> {
    try {
      const result = await this.sendDeleteByIdQuery(id);

      if (result === 0) {
        throw new NotFoundError({
          context: 'delete queue by id',
          details: {
            input: { id },
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
        context: 'delete queue by id',
        details: {
          input: { id },
        },
      });

      throw repositoryError;
    }
  }

  private async sendInsertReturningIdQuery(
    payload: object
  ): Promise<IInsertReturningId> {
    const query = this.dbClient
      .insert(payload)
      .into(this.tableName)
      .returning<IInsertReturningId>('id');

    return await query;
  }

  private async sendFindByIdQuery(
    id: IQueue['id']
  ): Promise<IQueue | undefined> {
    return this.dbClient<IQueue>(this.tableName).where('id', id).first();
  }

  private async sendGetAllQuery(): Promise<IQueue[] | undefined> {
    return this.dbClient<IQueue>(this.tableName).select('*');
  }

  private async sendCountAllQuery(): Promise<number> {
    const [result] = (await this.dbClient<IQueue>(this.tableName).count(
      '*'
    )) as { count: number }[];
    return result!.count;
  }

  private async sendUpdateByIdQuery(
    id: IQueue['id'],
    dto: IUpdateQueueDto
  ): Promise<number> {
    return await this.dbClient(this.tableName).where('id', id).update(dto);
  }

  private async sendDeleteByIdQuery(id: IQueue['id']): Promise<number> {
    return await this.dbClient(this.tableName).where('id', id).del();
  }
}

export { QueueRepository };
