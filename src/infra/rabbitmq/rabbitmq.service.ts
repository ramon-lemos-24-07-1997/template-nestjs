import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { RabbitMQConnection } from './rabbitmq.connection';
import { ChannelModel } from 'amqplib';

@Injectable()
export class RabbitMQService {
  private connection: ChannelModel;
  private readonly logger = new Logger(RabbitMQService.name);

  constructor(private readonly rabbitMQConnection: RabbitMQConnection) {}

  async publishToQueue(queue: string, message: any) {
    try {
      if (!this.connection) {
        this.connection = await this.rabbitMQConnection.getConnection();
      }
      const channel = await this.connection.createChannel();
      await channel.assertQueue(queue, { durable: true });
      const success = channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
        persistent: true,
      });
      if (!success) {
        this.logger.warn(`⚠️ Falha ao enviar para a fila ${queue}`);
      }
    } catch (error) {
      this.logger.error(`Erro ao publicar na fila ${queue}:`, error);
      throw error;
    } finally {
      if (this.connection) await this.connection.close();
    }
  }
}


