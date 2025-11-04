import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Paciente } from '../entities/paciente.entity';
import { Repository } from 'typeorm';
import { CreatePacienteDto } from '../dto/create-paciente.dto';
import { UpdatePacienteDto } from '../dto/update-paciente.dto';

// Interface para os parâmetros de paginação (Item 2.4)
export interface PaginacaoParams {
  page?: number;
  size?: number;
  sort?: string;
  busca?: string;
}

// Interface para a resposta paginada (Item 2.4)
export interface RespostaPaginada<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
}

/**
 * Função auxiliar para verificar se o erro é um erro de banco de dados
 * com um código específico (ex: '23505' para violação de 'unique')
 */
function isDatabaseError(error: unknown): error is { code: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as { code: unknown }).code === 'string'
  );
}

@Injectable()
export class PacientesService {
  constructor(
    @InjectRepository(Paciente)
    private pacientesRepository: Repository<Paciente>,
  ) {}

  /**
   * CREATE (Item 7 do roteiro)
   * Com validação de CPF duplicado
   */
  async create(createDto: CreatePacienteDto): Promise<Paciente> {
    try {
      const novoPaciente = this.pacientesRepository.create(createDto);
      return await this.pacientesRepository.save(novoPaciente);
    } catch (error: unknown) {
      // --- CORREÇÃO AQUI ---
      // Verificação de tipo segura (Type Guard)
      if (isDatabaseError(error) && error.code === '23505') {
        throw new ConflictException(
          'Já existe um paciente com este CPF ou CNS.',
        );
      }
      // Se for outro erro, apenas o relança
      throw error;
    }
  }

  /**
   * FIND ALL (com Paginação, Item 2.4)
   */
  async findAll(params: PaginacaoParams): Promise<RespostaPaginada<Paciente>> {
    const { page = 1, size = 10, sort = 'nome,ASC', busca = '' } = params;
    const [sortField, sortOrder] = sort.split(',');

    const query = this.pacientesRepository.createQueryBuilder('paciente');

    // Adiciona busca (se houver) - busca por nome ou CPF
    if (busca) {
      query.where('paciente.nome ILIKE :busca OR paciente.cpf LIKE :busca', {
        busca: `%${busca}%`,
      });
    }

    // Aplica ordenação
    query.orderBy(`paciente.${sortField}`, sortOrder as 'ASC' | 'DESC');

    // Aplica paginação
    query.skip((page - 1) * size).take(size);

    // Pega os resultados e o total
    const [items, total] = await query.getManyAndCount();

    return { items, total, page: Number(page), size: Number(size) };
  }

  /**
   * FIND ONE
   */
  async findOne(id: number): Promise<Paciente> {
    const paciente = await this.pacientesRepository.findOneBy({ id });
    if (!paciente) {
      throw new NotFoundException(`Paciente com ID #${id} não encontrado.`);
    }
    return paciente;
  }

  /**
   * UPDATE
   */
  async update(id: number, updateDto: UpdatePacienteDto): Promise<Paciente> {
    // 'preload' carrega a entidade existente e mescla os novos dados
    const paciente = await this.pacientesRepository.preload({
      id: id,
      ...updateDto,
    });

    if (!paciente) {
      throw new NotFoundException(`Paciente com ID #${id} não encontrado.`);
    }

    try {
      return await this.pacientesRepository.save(paciente);
    } catch (error: unknown) {
      // --- CORREÇÃO AQUI ---
      // Verificação de tipo segura (Type Guard)
      if (isDatabaseError(error) && error.code === '23505') {
        throw new ConflictException(
          'Já existe um paciente com este CPF ou CNS.',
        );
      }
      throw error;
    }
  }

  /**
   * DELETE
   */
  async remove(id: number): Promise<void> {
    const paciente = await this.findOne(id); // Reusa o findOne para checar se existe
    await this.pacientesRepository.remove(paciente);
  }
}
