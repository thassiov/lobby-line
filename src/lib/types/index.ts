import { Request, Response } from 'express';
import { KafkaMessage } from 'kafkajs';
import { Knex } from 'knex';
import z from 'zod';
import { BaseRepository, BaseService } from '../base-classes';

const databaseConfigSchema = z.object({
  host: z.string(),
  port: z.string(),
  user: z.string(),
  database: z.string(),
  password: z.string(),
});

type DatabaseConfig = z.infer<typeof databaseConfigSchema>;

const eventBrokerConfigSchema = z.object({
  clientId: z.string(),
  brokers: z.array(z.url()),
});

type EventBrokerConfig = z.infer<typeof eventBrokerConfigSchema>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Ctor<T> = abstract new (...args: any[]) => T;

type ServiceModule = {
  service: Ctor<BaseService>;
  repository: Ctor<BaseRepository>;
};

type EndpointHandler = (req: Request, res: Response) => Promise<void>;

type CreateServiceInstanceOptions = { url?: string; databaseClient?: Knex };

type TopicHandler = ({ message }: { message: KafkaMessage }) => Promise<void>;
type ConsumerIdentifier = { topic: string; handler: TopicHandler };

type RestApiConfig = { port: number };

export type {
  ConsumerIdentifier,
  CreateServiceInstanceOptions,
  DatabaseConfig,
  EndpointHandler,
  EventBrokerConfig,
  RestApiConfig,
  ServiceModule,
  TopicHandler,
};

export { databaseConfigSchema, eventBrokerConfigSchema };
