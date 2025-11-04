import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Prontuario } from './prontuario.entity';

@Entity('prontuario_receitas')
export class Receita {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'text' })
  texto: string; // Ex: "Dipirona 500mg, 1 comp 6/6h por 3 dias"

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  data: Date;

  @ManyToOne(() => Prontuario, (p) => p.receitas, { nullable: false })
  @JoinColumn({ name: 'prontuario_id' })
  prontuario: Prontuario;
}
