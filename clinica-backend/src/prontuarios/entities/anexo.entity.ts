import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Prontuario } from './prontuario.entity';

export type TipoAnexo = 'PDF' | 'IMG' | 'OUTRO';

@Entity('prontuario_anexos')
export class Anexo {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: 255 })
  nomeArquivo: string;

  @Column({ length: 500 })
  url: string; // URL para o arquivo (ex: S3, GCS, ou local)

  @Column({ type: 'enum', enum: ['PDF', 'IMG', 'OUTRO'] })
  tipo: TipoAnexo;

  @ManyToOne(() => Prontuario, (p) => p.anexos, { nullable: false })
  @JoinColumn({ name: 'prontuario_id' })
  prontuario: Prontuario;
}
