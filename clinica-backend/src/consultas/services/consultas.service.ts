import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Consulta } from '../entities/consulta.entity';
import { Repository } from 'typeorm';
import { CreateConsultaDto } from '../dto/create-consulta.dto';
import { UpdateConsultaDto } from '../dto/update-consulta.dto';

// Função Type Guard (copiada do outro serviço para verificação de erro)
function isDatabaseError(error: unknown): error is { code: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as { code: unknown }).code === 'string'
  );
}

@Injectable()
export class ConsultasService {
  constructor(
    @InjectRepository(Consulta)
    private consultasRepository: Repository<Consulta>,
  ) {}

  /**
   * CREATE (com Regra Anti-Choque)
   */
  async create(createDto: CreateConsultaDto): Promise<Consulta> {
    // Validação de regra de negócio (data futura)
    if (new Date(createDto.dataHora) <= new Date()) {
      throw new BadRequestException('A data da consulta deve ser no futuro.');
    }

    try {
      const novaConsulta = this.consultasRepository.create(createDto);
      // O save() vai disparar a constraint do banco se houver conflito
      return await this.consultasRepository.save(novaConsulta);
    } catch (error: unknown) {
      // --- REGRA DE NEGÓCIO (Item 6.4) ---
      // '23505' é o código do PostgreSQL para 'unique_violation'
      // Estamos pegando o erro da constraint UNIQUE(medico_id, data_hora)
      if (isDatabaseError(error) && error.code === '23505') {
        throw new ConflictException(
          'Este médico já possui uma consulta neste horário.',
        );
      }
      // '23503' é violação de FK (ex: medicoId ou pacienteId não existem)
      if (isDatabaseError(error) && error.code === '23503') {
        throw new NotFoundException(
          'O Paciente, Médico ou Especialidade não foi encontrado.',
        );
      }
      throw error;
    }
  }

  // Lista todas as consultas, com dados dos relacionamentos
  async findAll(): Promise<Consulta[]> {
    return this.consultasRepository.find({
      relations: ['paciente', 'medico', 'especialidade'],
      order: { dataHora: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Consulta> {
    const consulta = await this.consultasRepository.findOne({
      where: { id },
      relations: ['paciente', 'medico', 'especialidade'],
    });
    if (!consulta) {
      throw new NotFoundException(`Consulta com ID #${id} não encontrada.`);
    }
    return consulta;
  }

  async update(id: number, updateDto: UpdateConsultaDto): Promise<Consulta> {
    const consulta = await this.consultasRepository.preload({
      id: id,
      ...updateDto,
    });
    if (!consulta) {
      throw new NotFoundException(`Consulta com ID #${id} não encontrada.`);
    }

    try {
      return await this.consultasRepository.save(consulta);
    } catch (error: unknown) {
      if (isDatabaseError(error) && error.code === '23505') {
        throw new ConflictException(
          'Este médico já possui uma consulta neste horário (conflito ao reagendar).',
        );
      }
      throw error;
    }
  }

  // Consultas não são removidas (DELETE), apenas CANCELADAS (via PUT/PATCH)
  // Mas podemos criar o método de remoção para emergências
  async remove(id: number): Promise<void> {
    const consulta = await this.findOne(id);
    await this.consultasRepository.remove(consulta);
  }
}
