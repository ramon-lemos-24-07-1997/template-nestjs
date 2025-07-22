// src/rabbitmq/rabbitmq.module.ts
import { Module, Global } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';
import { RabbitMQConsumer } from './rabbitmq.consumer';
import { RabbitMQConnection } from './rabbitmq.connection';	

@Global() // torna os providers acessíveis em toda a aplicação
@Module({
  providers: [RabbitMQService, RabbitMQConsumer, RabbitMQConnection],
  exports: [RabbitMQService, RabbitMQConsumer, RabbitMQConnection],
})
export class RabbitMQModule {}
