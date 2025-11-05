import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Especialidade } from '../entities/especialidade.entity';
import { Repository } from 'typeorm';
import { CreateEspecialidadeDto } from '../dto/create-especialidade.dto';
import { UpdateEspecialidadeDto } from '../dto/update-especialidade.dto';

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
export class EspecialidadesService {
  constructor(
    @InjectRepository(Especialidade)
    private especialidadesRepository: Repository<Especialidade>,
  ) {}

  async create(createDto: CreateEspecialidadeDto): Promise<Especialidade> {
    try {
      const novaEspecialidade = this.especialidadesRepository.create(createDto);
      return await this.especialidadesRepository.save(novaEspecialidade);
    } catch (error: unknown) {
      if (isDatabaseError(error) && error.code === '23505') {
        throw new ConflictException(
          'Já existe uma especialidade com este nome.',
        );
      }
      throw error;
    }
  }

  // Este CRUD não precisa de paginação complexa por enquanto
  async findAll(): Promise<Especialidade[]> {
    return this.especialidadesRepository.find({
      order: { nome: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Especialidade> {
    const especialidade = await this.especialidadesRepository.findOneBy({ id });
    if (!especialidade) {
      throw new NotFoundException(`Especialidade com ID #${id} não encontrada.`);
    }
    return especialidade;
  }

  async update(
    id: number,
    updateDto: UpdateEspecialidadeDto,
  ): Promise<Especialidade> {
    const especialidade = await this.especialidadesRepository.preload({
      id: id,
      ...updateDto,
    });
    if (!especialidade) {
      throw new NotFoundException(`Especialidade com ID #${id} não encontrada.`);
    }
    try {
      return await this.especialidadesRepository.save(especialidade);
    } catch (error: unknown) {
      if (isDatabaseError(error) && error.code === '23505') {
        throw new ConflictException(
          'Já existe uma especialidade com este nome.',
        );
      }
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    const especialidade = await this.findOne(id);
    await this.especialidadesRepository.remove(especialidade);
  }
}