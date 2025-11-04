import { Consulta } from '../../consultas/entities/consulta.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Receita } from './receita.entity';
import { Atestado } from './atestado.entity';
import { Anexo } from './anexo.entity';

@Entity('prontuarios')
export class Prontuario {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'text', nullable: true })
  resumo: string; // Resumo da consulta

  // Relacionamento: 1:1 com a Consulta (Item 3.3)
  @OneToOne(() => Consulta, (consulta) => consulta.prontuario, {
    nullable: false,
  })
  @JoinColumn({ name: 'consulta_id' })
  consulta: Consulta;

  @Column({ name: 'consulta_id', unique: true }) // 'unique' garante o 1:1
  consultaId: number;

  // Relacionamentos com sub-entidades
  @OneToMany(() => Receita, (r) => r.prontuario, { cascade: ['insert'] })
  receitas: Receita[];

  @OneToMany(() => Atestado, (a) => a.prontuario, { cascade: ['insert'] })
  atestados: Atestado[];

  @OneToMany(() => Anexo, (a) => a.prontuario, { cascade: ['insert'] })
  anexos: Anexo[];

  // Auditoria (Item 2.2 e 3.4)
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Usuario, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  createdBy: Usuario; // Usuário (médico) que criou/editou

  @ManyToOne(() => Usuario, { nullable: true })
  @JoinColumn({ name: 'updated_by' })
  updatedBy: Usuario; // Usuário (médico) que criou/editou
}
