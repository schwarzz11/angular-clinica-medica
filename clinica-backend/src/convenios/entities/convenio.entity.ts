import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('convenios')
export class Convenio {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: 100, unique: true })
  nome: string;

  @Column({ default: true })
  ativo: boolean;

  @Column({ type: 'text', nullable: true })
  regras: string; // Ex: "Apenas consultas", "Desconto de 20% em exames"
}
