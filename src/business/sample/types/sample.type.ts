import z from 'zod';

const queueSchema = z.object({
  id: z.uuidv4(),
  queueProp: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

type IQueue = z.infer<typeof queueSchema>;

export { queueSchema };
export type { IQueue };
