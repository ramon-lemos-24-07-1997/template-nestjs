// src/rabbitmq/rabbitmq.consumer.ts
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ChannelModel } from 'amqplib';
import { RabbitMQConnection } from './rabbitmq.connection';


@Injectable()
export class RabbitMQConsumer implements OnModuleInit {
  private connection: ChannelModel;
  private readonly logger = new Logger(RabbitMQConsumer.name);

  constructor(private readonly rabbitMQConnection: RabbitMQConnection) {}

  async onModuleInit() {
    this.connection = await this.rabbitMQConnection.getConnection();
  }

  async consume(queue: string, callback: (msg: any) => Promise<void>) {
    const channel = await this.connection.createChannel();
    await channel.assertQueue(queue, { durable: true });
    const consumerTag = `consumer-${queue}`;  

    try {
      await channel.cancel(consumerTag);
    } catch (err) {
      this.logger.warn(`Nenhum consumidor anterior para cancelar na fila ${queue}`);
    }

    channel.consume(queue, async (msg) => {
      if (!msg) return;
      try {
        const data = JSON.parse(msg.content.toString());
        await callback(data);
        channel.ack(msg);
      } catch (error) {
        this.logger.error(`Erro ao processar mensagem da fila ${queue}:`, error);
        channel.nack(msg, false, false);
      }
    }, { consumerTag, noAck: false });

    this.logger.log(`✅ Consumidor registrado na fila ${queue}`);
  }
}

    