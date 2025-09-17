import z from 'zod';
import { sampleSchema } from './sample.type';

const createSampleDtoSchema = z
  .strictObject(sampleSchema.shape)
  .pick({ sampleProp: true });

type ICreateSampleDto = z.infer<typeof createSampleDtoSchema>;

const updateSampleDtoSchema = z
  .strictObject(sampleSchema.shape)
  .pick({ sampleProp: true });

type IUpdateSampleDto = z.infer<typeof updateSampleDtoSchema>;

export { createSampleDtoSchema, updateSampleDtoSchema };
export type { ICreateSampleDto, IUpdateSampleDto };
