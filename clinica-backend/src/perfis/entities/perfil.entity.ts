import { Permissao } from '../../permissoes/entities/permissao.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';

@Entity('perfis')
export class Perfil {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: 50, unique: true })
  nome: string; // Ex: 'ADMIN', 'MEDICO', 'ATENDENTE'

  // Relacionamento: Um perfil pode ter muitos usuários
  @OneToMany(() => Usuario, (usuario) => usuario.perfil)
  usuarios: Usuario[];

  // Relacionamento: Um perfil pode ter muitas permissões
  @ManyToMany(() => Permissao, (permissao) => permissao.perfis, {
    cascade: true, // Importante para salvar/associar
  })
  @JoinTable({
    name: 'perfil_permissao', // Nome da tabela de junção
    joinColumn: { name: 'perfil_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permissao_id', referencedColumnName: 'id' },
  })
  permissoes: Permissao[];
}
