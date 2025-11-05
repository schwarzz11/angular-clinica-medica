import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtPayload } from '../strategies/jwt.strategy';
import { Request } from 'express';

// Interface para tipar a requisição com o usuário
// --- CORREÇÃO AQUI ---
// Adicionamos 'export' para que outros módulos possam usá-la
export interface RequestWithUser extends Request {
  user: JwtPayload;
}

// Chave para o Decorator
export const PERMISSAO_KEY = 'permisao';

@Injectable()
export class PermissaoGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Pega a permissão necessária
    const permissaoNecessaria = this.reflector.getAllAndOverride<string>(
      PERMISSAO_KEY,
      [context.getHandler(), context.getClass()],
    );

    // 2. Se a rota não exige permissão, libera.
    if (!permissaoNecessaria) {
      return true;
    }

    // 3. Pega o usuário (tipado corretamente)
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const usuario = request.user;

    // 4. Verificação segura
    if (!usuario?.permissoes) {
      return false;
    }

    // 5. Verifica se a lista de permissões do usuário inclui a necessária
    return usuario.permissoes.includes(permissaoNecessaria);
  }
}
