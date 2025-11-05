import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Convenio } from '../entities/convenio.entity';
import { Repository } from 'typeorm';
import { CreateConvenioDto } from '../dto/create-convenio.dto';
import { UpdateConvenioDto } from '../dto/update-convenio.dto';

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
export class ConveniosService {
  constructor(
    @InjectRepository(Convenio)
    private conveniosRepository: Repository<Convenio>,
  ) {}

  async create(createDto: CreateConvenioDto): Promise<Convenio> {
    try {
      const novoConvenio = this.conveniosRepository.create(createDto);
      return await this.conveniosRepository.save(novoConvenio);
    } catch (error: unknown) {
      if (isDatabaseError(error) && error.code === '23505') {
        throw new ConflictException('Já existe um convênio com este nome.');
      }
      throw error;
    }
  }

  // Este CRUD não precisa de paginação complexa
  async findAll(): Promise<Convenio[]> {
    return this.conveniosRepository.find({
      order: { nome: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Convenio> {
    const convenio = await this.conveniosRepository.findOneBy({ id });
    if (!convenio) {
      throw new NotFoundException(`Convênio com ID #${id} não encontrado.`);
    }
    return convenio;
  }

  async update(id: number, updateDto: UpdateConvenioDto): Promise<Convenio> {
    const convenio = await this.conveniosRepository.preload({
      id: id,
      ...updateDto,
    });
    if (!convenio) {
      throw new NotFoundException(`Convênio com ID #${id} não encontrado.`);
    }
    try {
      return await this.conveniosRepository.save(convenio);
    } catch (error: unknown) {
      if (isDatabaseError(error) && error.code === '23505') {
        throw new ConflictException('Já existe um convênio com este nome.');
      }
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    const convenio = await this.findOne(id);
    await this.conveniosRepository.remove(convenio);
  }
}
