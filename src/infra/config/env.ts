import * as dotenv from 'dotenv';
import { Logger } from '@nestjs/common';

dotenv.config();
const logger = new Logger('Environment');

export class EnvironmentValidator {
  static validate(): void {
    logger.log('🔍 Validando variáveis de ambiente...');

    const requiredVars = [
      'RABBITMQ_URL',
      'PORT',
      'NODE_ENV',
    ];

    const missingVars: string[] = [];
    
    requiredVars.forEach((envVar) => {
      if (!process.env[envVar]) {
        missingVars.push(envVar);
      }
    });

    if (missingVars.length > 0) {
      const errorMessage = `❌ Variáveis obrigatórias não encontradas: ${missingVars.join(', ')}`;
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    logger.log('✅ Variáveis de ambiente validadas!');
    this.logConfig();
  }

  private static logConfig(): void {
    logger.log('🔧 Configuração:');
    logger.log(`  🚀 Porta: ${process.env.PORT}`);
    logger.log(`  🌍 Ambiente: ${process.env.NODE_ENV}`);
  }
}
