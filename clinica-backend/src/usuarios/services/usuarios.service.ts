import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from '../entities/usuario.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
  ) {}

  // Método para o AuthService usar
  // Busca um usuário pelo email, e crucialmente, inclui a senha
  // e as permissões do perfil (via 'relations')
  async findByEmail(email: string): Promise<Usuario | null> {
    return this.usuariosRepository.findOne({
      where: { email },
      // O 'select: false' na entidade Usuario esconde a senha.
      // Aqui, pedimos explicitamente por ela para a validação.
      select: ['id', 'nome', 'email', 'senha', 'ativo', 'perfilId'],
      relations: {
        perfil: {
          permissoes: true, // Traz o perfil e suas permissões (RBAC)
        },
      },
    });
  }
}
