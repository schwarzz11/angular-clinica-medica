import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Prontuario } from '../entities/prontuario.entity';
import { Repository } from 'typeorm';
import { CreateProntuarioDto } from '../dto/create-prontuario.dto';
import { UpdateProntuarioDto } from '../dto/update-prontuario.dto';
import { Consulta } from '../../consultas/entities/consulta.entity';
import { JwtPayload } from '../../auth/strategies/jwt.strategy';

// Função Type Guard
function isDatabaseError(error: unknown): error is { code: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as { code: unknown }).code === 'string'
  );
}

@Injectable()
export class ProntuariosService {
  constructor(
    @InjectRepository(Prontuario)
    private prontuariosRepository: Repository<Prontuario>,
    // Precisamos do repositório de Consultas para a regra de negócio
    @InjectRepository(Consulta)
    private consultasRepository: Repository<Consulta>,
  ) {}

  /**
   * CREATE (com Regra de Status)
   * O 'usuarioLogado' vem do @Request() no controller
   */
  async create(
    createDto: CreateProntuarioDto,
    usuarioLogado: JwtPayload,
  ): Promise<Prontuario> {
    // 1. Busca a consulta
    const consulta = await this.consultasRepository.findOneBy({
      id: createDto.consultaId,
    });

    if (!consulta) {
      throw new NotFoundException(
        `Consulta com ID #${createDto.consultaId} não encontrada.`,
      );
    }

    // --- REGRA DE NEGÓCIO (Item 6.5) ---
    if (
      consulta.status === 'CANCELADA' ||
      consulta.status === 'NAO_COMPARECEU'
    ) {
      throw new ForbiddenException(
        `Não é permitido criar prontuário para consultas com status ${consulta.status}.`,
      );
    }

    // 2. Prepara o novo prontuário
    const novoProntuario = this.prontuariosRepository.create({
      ...createDto,
      // Auditoria (Item 3.4)
      createdBy: { id: usuarioLogado.sub }, // Vincula ao ID do usuário logado
      updatedBy: { id: usuarioLogado.sub },
    });

    try {
      return await this.prontuariosRepository.save(novoProntuario);
    } catch (error: unknown) {
      // '23505' = violação de unique (já existe prontuário para esta consultaId)
      if (isDatabaseError(error) && error.code === '23505') {
        throw new ConflictException(
          'Já existe um prontuário para esta consulta.',
        );
      }

      // --- CORREÇÃO AQUI ---
      throw new InternalServerErrorException(
        'Erro ao salvar o prontuário.',
        { cause: error }, // Passamos o 'error' (unknown) como 'cause'
      );
    }
  }

  // Lista todos (geralmente filtrado por paciente ou médico, mas aqui listamos todos)
  async findAll(): Promise<Prontuario[]> {
    return this.prontuariosRepository.find({
      relations: [
        'consulta',
        'receitas',
        'atestados',
        'anexos',
        'createdBy',
        'updatedBy',
      ],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Prontuario> {
    const prontuario = await this.prontuariosRepository.findOne({
      where: { id },
      relations: [
        'consulta',
        'receitas',
        'atestados',
        'anexos',
        'createdBy',
        'updatedBy',
      ],
    });
    if (!prontuario) {
      throw new NotFoundException(`Prontuário com ID #${id} não encontrado.`);
    }
    return prontuario;
  }

  /**
   * UPDATE (com Auditoria)
   */
  async update(
    id: number,
    updateDto: UpdateProntuarioDto,
    usuarioLogado: JwtPayload,
  ): Promise<Prontuario> {
    // 'preload' mescla o DTO com a entidade existente
    const prontuario = await this.prontuariosRepository.preload({
      id: id,
      ...updateDto,
      // Atualiza o 'updatedBy' (Auditoria)
      updatedBy: { id: usuarioLogado.sub },
    });

    if (!prontuario) {
      throw new NotFoundException(`Prontuário com ID #${id} não encontrado.`);
    }

    try {
      return await this.prontuariosRepository.save(prontuario);
    } catch (error: unknown) {
      // --- CORREÇÃO AQUI ---
      throw new InternalServerErrorException(
        'Erro ao atualizar o prontuário.',
        { cause: error }, // Passamos o 'error' (unknown) como 'cause'
      );
    }
  }

  // Prontuários NUNCA devem ser deletados (Item 6.5)
  // Deixamos este método de fora intencionalmente.
}
