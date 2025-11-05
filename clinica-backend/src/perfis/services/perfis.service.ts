import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Perfil } from '../entities/perfil.entity';
import { In, Repository } from 'typeorm';
import { CreatePerfilDto } from '../dto/create-perfil.dto';
import { UpdatePerfilDto } from '../dto/update-perfil.dto';
import { Permissao } from '../../permissoes/entities/permissao.entity';

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
export class PerfisService {
  constructor(
    @InjectRepository(Perfil)
    private perfisRepository: Repository<Perfil>,
    // Precisamos do repositório de Permissoes para fazer a vinculação
    @InjectRepository(Permissao)
    private permissoesRepository: Repository<Permissao>,
  ) {}

  /**
   * Busca as entidades Permissao com base nos IDs (strings)
   */
  private async validarPermissoes(ids: string[]): Promise<Permissao[]> {
    if (!ids || ids.length === 0) {
      throw new BadRequestException(
        'A lista de permissões não pode ser vazia.',
      );
    }
    const permissoes = await this.permissoesRepository.findBy({
      id: In(ids), // 'In' é o operador SQL "IN (...)"
    });

    if (permissoes.length !== ids.length) {
      throw new NotFoundException(
        'Uma ou mais permissões não foram encontradas.',
      );
    }
    return permissoes;
  }

  async create(createDto: CreatePerfilDto): Promise<Perfil> {
    // 1. Valida e busca as entidades Permissao
    const permissoes = await this.validarPermissoes(createDto.permissoesIds);

    // 2. Cria o novo perfil
    const novoPerfil = this.perfisRepository.create({
      nome: createDto.nome,
      permissoes: permissoes, // Vincula as entidades
    });

    try {
      return await this.perfisRepository.save(novoPerfil);
    } catch (error: unknown) {
      if (isDatabaseError(error) && error.code === '23505') {
        throw new ConflictException('Já existe um perfil com este nome.');
      }
      throw error;
    }
  }

  // Lista todos os perfis, já trazendo as permissões vinculadas
  async findAll(): Promise<Perfil[]> {
    return this.perfisRepository.find({
      relations: ['permissoes'], // Traz o N:N
      order: { nome: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Perfil> {
    const perfil = await this.perfisRepository.findOne({
      where: { id },
      relations: ['permissoes'],
    });
    if (!perfil) {
      throw new NotFoundException(`Perfil com ID #${id} não encontrado.`);
    }
    return perfil;
  }

  async update(id: number, updateDto: UpdatePerfilDto): Promise<Perfil> {
    const perfil = await this.findOne(id); // Já checa se existe

    // Valida as permissões, APENAS se elas forem enviadas
    let permissoes: Permissao[] | undefined = undefined;
    if (updateDto.permissoesIds) {
      permissoes = await this.validarPermissoes(updateDto.permissoesIds);
    }

    // Mescla os dados (nome e/ou permissões)
    this.perfisRepository.merge(perfil, {
      nome: updateDto.nome,
      permissoes: permissoes,
    });

    try {
      return await this.perfisRepository.save(perfil);
    } catch (error: unknown) {
      if (isDatabaseError(error) && error.code === '23505') {
        throw new ConflictException('Já existe um perfil com este nome.');
      }
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    const perfil = await this.findOne(id);
    await this.perfisRepository.remove(perfil);
  }
}
