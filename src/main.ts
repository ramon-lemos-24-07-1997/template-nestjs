import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  logger.log('Iniciando aplicação NestJS...');
  
  const app = await NestFactory.create(AppModule);
  
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  
  logger.log(`🚀 Server is running on port ${port}`);
  logger.debug('Aplicação inicializada com sucesso');
  logger.warn('Aviso: Aplicação está em modo de desenvolvimento');
  logger.error('Erro: Aplicação não inicializada');
}
bootstrap();