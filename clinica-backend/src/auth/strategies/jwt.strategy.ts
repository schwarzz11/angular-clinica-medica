import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../auth.module'; // Importamos o segredo

// Interface para o payload que está DENTRO do JWT
export interface JwtPayload {
  sub: number;
  email: string;
  perfil: string;
  permissoes: string[];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret, // Usa o mesmo segredo do auth.module
    });
  }

  /**
   * Esta função é chamada pelo Passport após validar o token com sucesso.
   * O 'payload' é o objeto que colocamos dentro do JWT no auth.service.ts
   * O retorno desta função é o que será injetado em `request.user`
   */
  async validate(payload: JwtPayload): Promise<JwtPayload> {
    // Neste ponto, o token já é válido (assinatura e expiração).
    // Poderíamos fazer uma checagem extra no banco aqui (ex: verificar se usuário está 'ativo'),
    // mas para este projeto, o payload do token é suficiente.
    if (!payload) {
      throw new UnauthorizedException('Token inválido ou expirado.');
    }

    // O objeto retornado será o `request.user` em todos os controllers protegidos
    return payload;
  }
}
