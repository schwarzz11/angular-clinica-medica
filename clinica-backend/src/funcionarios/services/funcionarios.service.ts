import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Funcionario } from '../entities/funcionario.entity';
import { Especialidade } from '../../especialidades/entities/especialidade.entity';
import { Repository, In } from 'typeorm';
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
    @InjectRepository(Especialidade)
    private especialidadesRepository: Repository<Especialidade>,
  ) {}

  async create(createDto: CreateFuncionarioDto): Promise<Funcionario> {
    try {
      const novoFuncionario = this.funcionariosRepository.create({
        nome: createDto.nome,
        telefone: createDto.telefone,
        tipo: createDto.tipo,
        crm: createDto.crm,
        usuarioId: createDto.usuarioId,
      });

      // Se houver especialidades, busca e associa
      if (createDto.especialidadeIds && createDto.especialidadeIds.length > 0) {
        const especialidades = await this.especialidadesRepository.findBy({
          id: In(createDto.especialidadeIds),
        });
        novoFuncionario.especialidades = especialidades;
      }

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
      .leftJoinAndSelect('funcionario.usuario', 'usuario')
      .leftJoinAndSelect('funcionario.especialidades', 'especialidades');

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
    const funcionario = await this.funcionariosRepository.findOne({
      where: { id },
      relations: ['especialidades'],
    });

    if (!funcionario) {
      throw new NotFoundException(`Funcionário com ID #${id} não encontrado.`);
    }

    // Atualiza apenas os campos que foram fornecidos
    if (updateDto.nome !== undefined) {
      funcionario.nome = updateDto.nome;
    }
    if (updateDto.telefone !== undefined) {
      funcionario.telefone = updateDto.telefone;
    }
    if (updateDto.tipo !== undefined) {
      funcionario.tipo = updateDto.tipo;
    }
    if (updateDto.crm !== undefined) {
      funcionario.crm = updateDto.crm;
    }
    if (updateDto.usuarioId !== undefined) {
      funcionario.usuarioId = updateDto.usuarioId;
    }

    // Atualiza especialidades se fornecido
    if (updateDto.especialidadeIds !== undefined) {
      if (updateDto.especialidadeIds.length > 0) {
        const especialidades = await this.especialidadesRepository.findBy({
          id: In(updateDto.especialidadeIds),
        });
        funcionario.especialidades = especialidades;
      } else {
        funcionario.especialidades = [];
      }
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

    try {
      // Busca todas as consultas vinculadas a este funcionário
      const consultas = await this.funcionariosRepository.manager
        .createQueryBuilder()
        .select('consulta.id', 'id')
        .from('consultas', 'consulta')
        .where('consulta.medico_id = :id', { id })
        .getRawMany();

      const consultaIds = consultas.map((c) => c.id);

      // Se houver consultas vinculadas, remove em cascata: prontuários -> consultas
      if (consultaIds.length > 0) {
        // Busca os IDs dos prontuários vinculados às consultas
        const prontuarios = await this.funcionariosRepository.manager
          .createQueryBuilder()
          .select('prontuario.id', 'id')
          .from('prontuarios', 'prontuario')
          .where('prontuario.consulta_id IN (:...ids)', { ids: consultaIds })
          .getRawMany();

        const prontuarioIds = prontuarios.map((p) => p.id);

        // Remove entidades relacionadas aos prontuários (receitas, atestados, anexos)
        if (prontuarioIds.length > 0) {
          await this.funcionariosRepository.manager
            .createQueryBuilder()
            .delete()
            .from('prontuario_receitas')
            .where('prontuario_id IN (:...ids)', { ids: prontuarioIds })
            .execute();

          await this.funcionariosRepository.manager
            .createQueryBuilder()
            .delete()
            .from('prontuario_atestados')
            .where('prontuario_id IN (:...ids)', { ids: prontuarioIds })
            .execute();

          await this.funcionariosRepository.manager
            .createQueryBuilder()
            .delete()
            .from('prontuario_anexos')
            .where('prontuario_id IN (:...ids)', { ids: prontuarioIds })
            .execute();
        }

        // Remove prontuários vinculados às consultas
        if (prontuarioIds.length > 0) {
          await this.funcionariosRepository.manager
            .createQueryBuilder()
            .delete()
            .from('prontuarios')
            .where('consulta_id IN (:...ids)', { ids: consultaIds })
            .execute();
        }

        // Remove as consultas
        await this.funcionariosRepository.manager
          .createQueryBuilder()
          .delete()
          .from('consultas')
          .where('medico_id = :id', { id })
          .execute();
      }

      // Remove primeiro as relações ManyToMany (especialidades)
      if (funcionario.especialidades && funcionario.especialidades.length > 0) {
        funcionario.especialidades = [];
        await this.funcionariosRepository.save(funcionario);
      }

      // Remove o funcionário
      await this.funcionariosRepository.remove(funcionario);
    } catch (error: unknown) {
      // Erro '23503' = violação de FK (ex: ainda há consultas vinculadas)
      if (isDatabaseError(error) && error.code === '23503') {
        throw new ConflictException(
          'Não é possível excluir o funcionário. Ele está vinculado a outros registros (consultas, prontuários, etc.).',
        );
      }
      throw error;
    }
  }
}
