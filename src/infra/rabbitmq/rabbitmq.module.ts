import { Module, Global } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';
import { RabbitMQConsumer } from './rabbitmq.consumer';
import { RabbitMQConnection } from './rabbitmq.connection';	

@Global() 
@Module({
  providers: [RabbitMQService, RabbitMQConsumer, RabbitMQConnection],
  exports: [RabbitMQService, RabbitMQConsumer],
})
export class RabbitMQModule {}
