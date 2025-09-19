import z from 'zod';
import { queueSchema } from './queue.type';

const createQueueDtoSchema = z
  .strictObject(queueSchema.shape)
  .pick({ queueProp: true });

type ICreateQueueDto = z.infer<typeof createQueueDtoSchema>;

const updateQueueDtoSchema = z
  .strictObject(queueSchema.shape)
  .pick({ queueProp: true });

type IUpdateQueueDto = z.infer<typeof updateQueueDtoSchema>;

export { createQueueDtoSchema, updateQueueDtoSchema };
export type { ICreateQueueDto, IUpdateQueueDto };
