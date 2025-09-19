import z from 'zod';

const queueSchema = z.object({
  id: z.uuidv4(),
  name: z.string().min(3).max(50),
  createdAt: z.date(),
  updatedAt: z.date(),
});

type IQueue = z.infer<typeof queueSchema>;

export { queueSchema };
export type { IQueue };
