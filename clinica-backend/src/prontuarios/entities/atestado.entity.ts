import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Prontuario } from './prontuario.entity';

@Entity('prontuario_atestados')
export class Atestado {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'text' })
  texto: string; // Ex: "Atesto que..."

  @Column({ type: 'int', nullable: true })
  diasAfastamento: number;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  data: Date;

  @ManyToOne(() => Prontuario, (p) => p.atestados, { nullable: false })
  @JoinColumn({ name: 'prontuario_id' })
  prontuario: Prontuario;
}
