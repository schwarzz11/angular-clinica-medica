import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtPayload } from '../strategies/jwt.strategy';
import { Request } from 'express'; // <-- 1. Importe o 'Request' do express

// Interface para tipar a requisição com o usuário
// Isso informa ao TypeScript que `request.user` existe e é do tipo `JwtPayload`
interface RequestWithUser extends Request {
  user: JwtPayload;
}

// Chave para o Decorator
export const PERMISSAO_KEY = 'permisao';

@Injectable()
export class PermissaoGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Pega a permissão necessária (ex: 'paciente:criar') do @Decorator
    const permissaoNecessaria = this.reflector.getAllAndOverride<string>(
      PERMISSAO_KEY,
      [context.getHandler(), context.getClass()],
    );

    // 2. Se a rota não exige permissão (ex: é pública), libera.
    if (!permissaoNecessaria) {
      return true;
    }

    // 3. Pega o usuário (payload do JWT)
    // --- CORREÇÃO AQUI ---
    // Tipamos a requisição inteira primeiro, usando a interface que criamos
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const usuario = request.user; // Agora 'usuario' é 'JwtPayload', não 'any'

    // 4. Verificação segura
    if (!usuario?.permissoes) {
      // Verifica se 'usuario' existe E se 'permissoes' existem dentro dele
      return false; // Usuário não encontrado ou sem permissões
    }

    // 5. Verifica se a lista de permissões do usuário inclui a necessária
    return usuario.permissoes.includes(permissaoNecessaria);
  }
}
