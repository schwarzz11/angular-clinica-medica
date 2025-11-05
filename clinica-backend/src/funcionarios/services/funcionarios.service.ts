import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Funcionario } from '../entities/funcionario.entity';
import { Repository } from 'typeorm';
import { CreateFuncionarioDto } from '../dto/create-funcionario.dto';
import { UpdateFuncionarioDto } from '../dto/update-funcionario.dto';

// Reutilizando as interfaces que exportamos do pacientes.service
import {
  PaginacaoParams,
  RespostaPaginada,
} from '../../pacientes/services/pacientes.service';

/**
 * Função auxiliar (Type Guard) para verificação segura de erros
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
export class FuncionariosService {
  constructor(
    @InjectRepository(Funcionario)
    private funcionariosRepository: Repository<Funcionario>,
  ) {}

  async create(createDto: CreateFuncionarioDto): Promise<Funcionario> {
    try {
      const novoFuncionario = this.funcionariosRepository.create(createDto);
      return await this.funcionariosRepository.save(novoFuncionario);
    } catch (error: unknown) {
      // Erro '23503' = violação de FK (ex: usuarioId não existe)
      if (isDatabaseError(error) && error.code === '23503') {
        throw new ConflictException('O ID de usuário fornecido não existe.');
      }
      // Erro '23505' = violação de unique (ex: CRM ou usuarioId duplicado)
      if (isDatabaseError(error) && error.code === '23505') {
        throw new ConflictException(
          'Já existe um funcionário com este CRM ou este usuário já está vinculado.',
        );
      }
      throw error;
    }
  }

  async findAll(
    params: PaginacaoParams,
  ): Promise<RespostaPaginada<Funcionario>> {
    const { page = 1, size = 10, sort = 'nome,ASC', busca = '' } = params;
    const [sortField, sortOrder] = sort.split(',');

    const query = this.funcionariosRepository
      .createQueryBuilder('funcionario')
      .leftJoinAndSelect('funcionario.usuario', 'usuario') // Traz dados do usuário vinculado
      .leftJoinAndSelect('funcionario.especialidades', 'especialidades'); // Traz especialidades

    if (busca) {
      query.where(
        'funcionario.nome ILIKE :busca OR funcionario.crm LIKE :busca',
        {
          busca: `%${busca}%`,
        },
      );
    }

    query.orderBy(`funcionario.${sortField}`, sortOrder as 'ASC' | 'DESC');
    query.skip((page - 1) * size).take(size);

    const [items, total] = await query.getManyAndCount();
    return { items, total, page: Number(page), size: Number(size) };
  }

  async findOne(id: number): Promise<Funcionario> {
    const funcionario = await this.funcionariosRepository.findOne({
      where: { id },
      relations: ['usuario', 'especialidades'],
    });
    if (!funcionario) {
      throw new NotFoundException(`Funcionário com ID #${id} não encontrado.`);
    }
    return funcionario;
  }

  async update(
    id: number,
    updateDto: UpdateFuncionarioDto,
  ): Promise<Funcionario> {
    const funcionario = await this.funcionariosRepository.preload({
      id: id,
      ...updateDto,
    });
    if (!funcionario) {
      throw new NotFoundException(`Funcionário com ID #${id} não encontrado.`);
    }

    try {
      return await this.funcionariosRepository.save(funcionario);
    } catch (error: unknown) {
      if (isDatabaseError(error) && error.code === '23503') {
        throw new ConflictException('O ID de usuário fornecido não existe.');
      }
      if (isDatabaseError(error) && error.code === '23505') {
        throw new ConflictException(
          'Já existe um funcionário com este CRM ou este usuário já está vinculado.',
        );
      }
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    const funcionario = await this.findOne(id);
    await this.funcionariosRepository.remove(funcionario);
  }
}
