import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { EnvironmentValidator } from './infra/config/env';
import * as gracefulShutdown from "http-graceful-shutdown";
import { now } from './common/helpers/date';
import helmet from 'helmet';
import { RateLimitGuard } from './common/middleware/rate-limit.guard';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  EnvironmentValidator.validate();

  const app = await NestFactory.create(AppModule);
  
  app.use(helmet());
  app.enableCors(); 

  app.useGlobalGuards(new RateLimitGuard())

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Remove propriedades não decoradas
    forbidNonWhitelisted: true, // Rejeita requisições com propriedades não permitidas
    transform: true, // Transforma automaticamente os tipos
    transformOptions: {
      enableImplicitConversion: true, // Transforma automaticamente os tipos
    },
  }));
  
  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  gracefulShutdown(app.getHttpServer());

  logger.log(`🚀 Aplicação iniciada com sucesso!`, now());
}

bootstrap();