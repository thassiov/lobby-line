import { Consumer, Kafka, Message, Producer } from 'kafkajs';
import { setupLogger } from '../logger';
import { ConsumerIdentifier, TopicHandler } from '../types';

class BaseEventChannel {
  protected logger;
  protected brokerClient: Kafka;
  protected producer: Producer | undefined;
  protected consumers: Map<ConsumerIdentifier, Consumer>;

  constructor(
    private readonly moduleName: string,
    brokerClient: Kafka
  ) {
    this.logger = setupLogger(moduleName);
    this.brokerClient = brokerClient;
    this.producer = undefined;
    this.consumers = new Map();
  }

  async sendMessageToTopic(topic: string, messages: Message[]): Promise<void> {
    if (!this.producer) {
      await this.createProducer();
    }

    await this.producer?.send({
      topic,
      messages,
    });
  }

  async consumeFromTopic(topic: string, handler: TopicHandler) {
    const consumerIdentifier = { topic, handler };

    const alreadyExists = this.consumers.get(consumerIdentifier);

    if (alreadyExists) {
      throw new Error(
        `the provided handler is already consuming from ${topic}`
      );
    }

    const consumer = this.brokerClient.consumer({ groupId: this.moduleName });
    await consumer.subscribe({ topic, fromBeginning: true });
    await consumer.run({ eachMessage: handler });
    this.consumers.set(consumerIdentifier, consumer);
  }

  private async createProducer(): Promise<void> {
    const producer = this.brokerClient.producer();
    await producer.connect();
    this.producer = producer;
  }
}

export { BaseEventChannel };
