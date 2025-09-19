import z from 'zod';
import { queueSchema } from './queue.type';

const createQueueDtoSchema = z
  .strictObject(queueSchema.shape)
  .pick({ name: true });

type ICreateQueueDto = z.infer<typeof createQueueDtoSchema>;

const updateQueueDtoSchema = z
  .strictObject(queueSchema.shape)
  .pick({ name: true });

type IUpdateQueueDto = z.infer<typeof updateQueueDtoSchema>;

export { createQueueDtoSchema, updateQueueDtoSchema };
export type { ICreateQueueDto, IUpdateQueueDto };
