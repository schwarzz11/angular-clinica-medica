import { Perfil } from '../../perfis/entities/perfil.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: 100 })
  nome: string;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({ length: 100, select: false }) // 'select: false' omite a senha em selects
  senha: string;

  @Column({ default: true })
  ativo: boolean;

  // Relacionamento: Muitos usuários podem ter um perfil
  @ManyToOne(() => Perfil, (perfil) => perfil.usuarios, {
    eager: true, // 'eager: true' traz o perfil junto ao buscar o usuário
  })
  @JoinColumn({ name: 'perfil_id' }) // Nome da coluna FK
  perfil: Perfil;

  @Column({ name: 'perfil_id' })
  perfilId: number;

  // Hook do TypeORM: Antes de inserir, criptografa a senha
  @BeforeInsert()
  async hashPassword() {
    const saltRounds = 10;
    this.senha = await bcrypt.hash(this.senha, saltRounds);
  }

  // Método para validar a senha (usado no login)
  async validatePassword(senhaDigitada: string): Promise<boolean> {
    return bcrypt.compare(senhaDigitada, this.senha);
  }
}
