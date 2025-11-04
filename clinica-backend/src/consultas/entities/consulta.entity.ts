import { Especialidade } from '../../especialidades/entities/especialidade.entity';
import { Funcionario } from '../../funcionarios/entities/funcionario.entity';
import { Paciente } from '../../pacientes/entities/paciente.entity';
import { Prontuario } from '../../prontuarios/entities/prontuario.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  OneToOne,
} from 'typeorm';

// Conforme roteiro (Item 2.2)
export type TipoConsulta = 'RETORNO' | 'AVALIACAO' | 'EXAME';
export type StatusConsulta =
  | 'AGENDADA'
  | 'CONFIRMADA'
  | 'CANCELADA'
  | 'CONCLUIDA'
  | 'NAO_COMPARECEU';

@Entity('consultas')
@Index(['medico', 'dataHora'], { unique: true }) // Constraint (Item 3.3 e 6.4)
export class Consulta {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'timestamptz' }) // 'timestamptz' armazena com fuso horário (Item 6.8)
  dataHora: Date;

  @Column({
    type: 'enum',
    enum: ['RETORNO', 'AVALIACAO', 'EXAME'],
    nullable: true,
  })
  tipo: TipoConsulta;

  @Column({
    type: 'enum',
    enum: [
      'AGENDADA',
      'CONFIRMADA',
      'CANCELADA',
      'CONCLUIDA',
      'NAO_COMPARECEU',
    ],
    default: 'AGENDADA',
  })
  status: StatusConsulta;

  @Column({ type: 'text', nullable: true })
  observacoes: string; // Ex: "Paciente pediu para ligar 1 dia antes"

  // Relacionamento: Paciente
  @ManyToOne(() => Paciente, { nullable: false })
  @JoinColumn({ name: 'paciente_id' })
  paciente: Paciente;

  @Column({ name: 'paciente_id' })
  pacienteId: number;

  // Relacionamento: Médico (Funcionario)
  @ManyToOne(() => Funcionario, { nullable: false })
  @JoinColumn({ name: 'medico_id' })
  medico: Funcionario;

  @Column({ name: 'medico_id' })
  medicoId: number;

  // Relacionamento: Especialidade
  @ManyToOne(() => Especialidade, { nullable: false })
  @JoinColumn({ name: 'especialidade_id' })
  especialidade: Especialidade;

  @Column({ name: 'especialidade_id' })
  especialidadeId: number;

  // Relacionamento: Prontuário (1:1)
  @OneToOne(() => Prontuario, (prontuario) => prontuario.consulta)
  prontuario: Prontuario;
}
