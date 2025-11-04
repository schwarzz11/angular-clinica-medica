import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

// Classe de Endereço Embutido (Item 2.2)
// Não é uma @Entity, mas uma classe que será "embutida"
export class Endereco {
  @Column({ length: 9, nullable: true })
  cep: string;

  @Column({ length: 255, nullable: true })
  logradouro: string;

  @Column({ length: 20, nullable: true })
  numero: string;

  @Column({ length: 100, nullable: true })
  complemento: string;

  @Column({ length: 100, nullable: true })
  bairro: string;

  @Column({ length: 100, nullable: true })
  cidade: string;

  @Column({ length: 2, nullable: true })
  uf: string;
}

@Entity('pacientes')
export class Paciente {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: 100 })
  nome: string;

  @Column({ length: 14, unique: true }) // 11.123.456-00
  cpf: string;

  @Column({ length: 18, nullable: true, unique: true }) // CNS
  cns: string;

  @Column({ length: 100, nullable: true })
  email: string;

  @Column({ length: 20, nullable: true })
  telefone: string;

  @Column({ type: 'date' }) // Apenas a data
  dataNascimento: string;

  // Coluna "embutida"
  @Column(() => Endereco, { prefix: 'end' }) // prefixo evita colisão de nomes
  endereco: Endereco;

  // Auditoria (Item 2.2)
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
