import z from 'zod';
import { queueItemSchema } from './queue-item.type';

const createQueueItemDtoSchema = z
  .strictObject(queueItemSchema.shape)
  .pick({ queueId: true, priority: true, meta: true });

type ICreateQueueItemDto = z.infer<typeof createQueueItemDtoSchema>;

const updateQueueItemStatusDtoSchema = z
  .strictObject(queueItemSchema.shape)
  .pick({ status: true });

type IUpdateQueueItemStatusDto = z.infer<typeof updateQueueItemStatusDtoSchema>;

export { createQueueItemDtoSchema, updateQueueItemStatusDtoSchema };
export type { ICreateQueueItemDto, IUpdateQueueItemStatusDto };
