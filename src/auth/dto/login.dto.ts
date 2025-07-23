// src/auth/dto/login.dto.ts
import { IsEmail, IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';

export class LoginDto {

  @IsEmail({}, { message: 'Email deve ser válido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @IsString({ message: 'Senha deve ser uma string' })
  // @MinLength(8, { message: 'Senha deve ter pelo menos 6 caracteres' })
  // @MaxLength(8, { message: 'Senha deve ter no máximo 8 caracteres' })
  // @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, { message: 'Senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial' })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  password: string;

  @IsBoolean({ message: 'Remember deve ser um booleano' })
  @IsOptional({ message: 'Remember é opcional' })
  remember: boolean;
}