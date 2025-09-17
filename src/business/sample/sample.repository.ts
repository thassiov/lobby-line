import { Knex } from 'knex';
import { IInsertReturningId } from '../../infra/database/postgres/types';
import { BaseRepository } from '../../lib/base-classes';
import { internalConfigs } from '../../lib/config';
import { NotFoundError, UnexpectedError } from '../../lib/errors';
import { BaseCustomError } from '../../lib/errors/base-custom-error.error';
import { ICreateSampleDto, IUpdateSampleDto } from './types/dto.type';
import { ISample } from './types/sample.type';

class SampleRepository extends BaseRepository {
  private tableName: string;
  constructor(private readonly dbClient: Knex) {
    super('account-repository');
    this.tableName = internalConfigs.repository.sample.tableName;
  }

  async create(createDto: ICreateSampleDto): Promise<ISample['id']> {
    try {
      const [result] = await this.sendInsertReturningIdQuery(createDto);

      if (!result) {
        const errorInstance = new UnexpectedError({
          context: 'create sample',
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
        context: 'create sample',
        details: {
          input: createDto,
        },
      });

      this.logger.error(errorInstance);
      throw errorInstance;
    }
  }

  async getById(id: ISample['id']): Promise<ISample | undefined> {
    try {
      return await this.sendFindByIdQuery(id);
    } catch (error) {
      const repositoryError = new UnexpectedError({
        cause: error as Error,
        context: 'get sample by id',
        details: {
          input: { id },
        },
      });

      throw repositoryError;
    }
  }

  async updateById(
    id: ISample['id'],
    updateSampleDto: IUpdateSampleDto
  ): Promise<boolean> {
    try {
      const result = await this.sendUpdateByIdQuery(id, updateSampleDto);

      if (result === 0) {
        const errorInstance = new NotFoundError({
          context: 'update sample by id',
          details: {
            input: { id, ...updateSampleDto },
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
        context: 'update sample by id',
        details: {
          input: { id, ...updateSampleDto },
        },
      });

      this.logger.error(errorInstance);
      throw errorInstance;
    }
  }

  async deleteById(id: ISample['id']): Promise<boolean> {
    try {
      const result = await this.sendDeleteByIdQuery(id);

      if (result === 0) {
        throw new NotFoundError({
          context: 'delete sample by id',
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
        context: 'delete sample by id',
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
    id: ISample['id']
  ): Promise<ISample | undefined> {
    return this.dbClient<ISample>(this.tableName).where('id', id).first();
  }

  private async sendUpdateByIdQuery(
    id: ISample['id'],
    dto: IUpdateSampleDto
  ): Promise<number> {
    return await this.dbClient(this.tableName).where('id', id).update(dto);
  }

  private async sendDeleteByIdQuery(id: ISample['id']): Promise<number> {
    return await this.dbClient(this.tableName).where('id', id).del();
  }
}

export { SampleRepository };
