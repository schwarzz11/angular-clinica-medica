import { Perfil } from '../../perfis/entities/perfil.entity';
import { Entity, PrimaryColumn, Column, ManyToMany } from 'typeorm';

@Entity('permissoes')
export class Permissao {
  @PrimaryColumn({ length: 50 })
  id: string; // Ex: 'paciente:criar', 'paciente:ler'

  @Column({ length: 100 })
  descricao: string;

  // Relacionamento: Muitas permissões podem pertencer a muitos perfis
  @ManyToMany(() => Perfil, (perfil) => perfil.permissoes)
  perfis: Perfil[];
}
