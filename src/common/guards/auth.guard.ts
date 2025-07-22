import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = request.headers['fcm-api-key'];
    try {
      if (!apiKey) {
        this.logger.warn('Tentativa de acesso sem API Key');
        throw new UnauthorizedException('API Key não fornecida');
      }
      if (apiKey !== process.env.API_SECRET_KEY) {
        this.logger.warn(`API Key inválida: ${apiKey}`);
        throw new UnauthorizedException('API Key inválida');
      }
      this.logger.log('Acesso autorizado via API Key');
      return true;
    } catch (error) {
      this.logger.error('Erro durante verificação da API Key:', error);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Erro durante autenticação');
    }
  }
} 