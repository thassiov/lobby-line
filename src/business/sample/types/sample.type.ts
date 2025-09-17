import z from 'zod';

const sampleSchema = z.object({
  id: z.uuidv4(),
  sampleProp: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

type ISample = z.infer<typeof sampleSchema>;

export { sampleSchema };
export type { ISample };
