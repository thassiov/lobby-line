import z from 'zod';

const queueItemSchema = z.object({
  id: z.uuidv4(),
  queueId: z.uuidv4(),
  status: z.enum(['open', 'closed']),
  priority: z.number().min(1).max(10).optional(),
  meta: z.json().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

type IQueueItem = z.infer<typeof queueItemSchema>;

export { queueItemSchema };
export type { IQueueItem };
