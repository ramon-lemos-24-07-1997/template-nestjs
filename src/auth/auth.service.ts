// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../infra/database/prisma/prisma.service';
import { addHours, addDays } from 'date-fns';
import * as bcrypt from 'bcrypt';
import { CustomException } from 'src/common/exceptions/custom.exception';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async validateUser(email: string, password: string) {
    try {
      const user = await this.prisma.users.findUnique({
        where: { email }
      });
      if (!user) {
        throw new CustomException('Usuário ou senha incorretos', 404);
      }
      let isPasswordValid = false;
      if (user) {
        isPasswordValid = await bcrypt.compare(password, user.password);
      } 
      if (!isPasswordValid) {
        throw new CustomException('Usuário ou senha incorretos', 401);
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async login(user: any, rememberMe: boolean = false) {
    try {
      const expiresAt = rememberMe 
        ? addDays(new Date(), 30) 
        : addHours(new Date(), 1);
      const payload = {
        sub: user.id,
        email: user.email,
        role: user.role,
        exp: Math.floor(expiresAt.getTime() / 1000), 
        iat: Math.floor(Date.now() / 1000), 
      };
      const token = this.jwtService.sign(payload);
      return {
        access_token: token,
        user
      };
    } catch (error) {
      throw new CustomException('Erro ao gerar token', 500);
    }
  }


}

