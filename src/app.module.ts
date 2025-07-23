import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RabbitMQModule } from './infra/rabbitmq/rabbitmq.module';
import { PrismaModule } from './infra/database/prisma/prisma.module';
import { AuthModule } from './auth/auth.module';


@Module({
  // imports: [RabbitMQModule, PrismaModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
