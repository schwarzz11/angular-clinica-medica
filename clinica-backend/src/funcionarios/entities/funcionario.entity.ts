import { Especialidade } from '../../especialidades/entities/especialidade.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

// Conforme roteiro (Item 2.2)
export type TipoFuncionario = 'MEDICO' | 'ATENDENTE' | 'OUTRO';

@Entity('funcionarios')
export class Funcionario {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: 100 })
  nome: string;

  @Column({ length: 20, nullable: true })
  telefone: string;

  @Column({
    type: 'enum',
    enum: ['MEDICO', 'ATENDENTE', 'OUTRO'],
  })
  tipo: TipoFuncionario;

  @Column({ length: 20, nullable: true }) // CRM (Obrigatório se tipo=MEDICO, validado no Service/DTO)
  crm: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relacionamento: Um funcionário PODE ser um usuário
  @OneToOne(() => Usuario, { nullable: true })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @Column({ name: 'usuario_id', nullable: true })
  usuarioId: number;

  // Relacionamento: Um funcionário (médico) pode ter N especialidades
  @ManyToMany(() => Especialidade, (espec) => espec.funcionarios, {
    cascade: true,
  })
  @JoinTable({
    name: 'funcionario_especialidade',
    joinColumn: { name: 'funcionario_id' },
    inverseJoinColumn: { name: 'especialidade_id' },
  })
  especialidades: Especialidade[];
}
