import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';

@Controller('auth') // Rota: /api/v1/auth
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Endpoint de Login (Item 7 do roteiro)
   */
  @HttpCode(HttpStatus.OK) // Responde 200 OK em vez de 201 Created
  @Post('login') // Rota: POST /api/v1/auth/login
  async login(@Body() loginDto: LoginDto) {
    // 1. Validar o usuário (email e senha)
    const usuarioValidado = await this.authService.validateUser(
      loginDto.email,
      loginDto.senha,
    );

    // 2. Se a validação falhar, lança 401
    if (!usuarioValidado) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    // 3. Se a validação for OK, chama o serviço de login para gerar o token
    return this.authService.login(usuarioValidado);
  }
}
