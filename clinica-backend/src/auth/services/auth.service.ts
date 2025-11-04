import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from '../../usuarios/services/usuarios.service';
import { Usuario } from '../../usuarios/entities/usuario.entity';

// Interface do objeto de sessão que o frontend espera (Item 2.2)
export interface UsuarioSessao {
  id: number;
  nome: string;
  email: string;
  perfil: string;
  permissoes: string[]; // Ex: ['paciente:criar', 'consulta:ler']
}

@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuariosService,
    private jwtService: JwtService,
  ) {}

  /**
   * Valida se um usuário existe e se a senha está correta.
   * (Chamado pelo LocalStrategy que criaremos a seguir)
   */
  async validateUser(email: string, pass: string): Promise<Usuario | null> {
    const usuario = await this.usuariosService.findByEmail(email);

    if (usuario && (await usuario.validatePassword(pass))) {
      // Se validou, podemos remover a senha antes de retornar
      // delete usuario.senha; // O 'select: false' já deve ter omitido, mas é uma garantia
      return usuario;
    }
    return null;
  }

  /**
   * Gera o Token JWT e o objeto de Sessão.
   * (Chamado pelo AuthController após o 'validateUser' ter sucesso)
   */
  async login(usuario: Usuario) {
    // 1. Extrair permissões do objeto de perfil
    // (O findByEmail no UsuariosService já trouxe isso via 'relations')
    const permissoesChaves = usuario.perfil?.permissoes?.map((p) => p.id) || [];

    // 2. Criar o Payload do JWT
    // 'sub' é o 'subject', padrão para o ID do usuário
    const payload = {
      sub: usuario.id,
      email: usuario.email,
      perfil: usuario.perfil?.nome,
      permissoes: permissoesChaves,
    };

    // 3. Criar o objeto de Sessão (O que o frontend vai receber)
    const usuarioSessao: UsuarioSessao = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      perfil: usuario.perfil?.nome,
      permissoes: permissoesChaves,
    };

    // 4. Retornar o token assinado e os dados da sessão (Item 7 do roteiro)
    return {
      token: this.jwtService.sign(payload),
      user: usuarioSessao,
    };
  }
}
