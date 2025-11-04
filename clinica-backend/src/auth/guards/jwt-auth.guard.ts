import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // O AuthGuard('jwt') automaticamente usa a JwtStrategy que registramos.
  // Não precisamos de mais nada aqui para verificar se o usuário está logado.
  // Se o token for inválido ou ausente, ele já retorna 401 Unauthorized.
}
