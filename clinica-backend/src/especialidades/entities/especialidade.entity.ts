import { Funcionario } from '../../funcionarios/entities/funcionario.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';

@Entity('especialidades')
export class Especialidade {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: 100, unique: true })
  nome: string;

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @Column({ default: true })
  ativa: boolean;

  // Relacionamento: Muitas especialidades para muitos funcionários (médicos)
  @ManyToMany(() => Funcionario, (funcionario) => funcionario.especialidades)
  funcionarios: Funcionario[];
}
