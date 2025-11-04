import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permissao } from '../../permissoes/entities/permissao.entity';
import { Repository } from 'typeorm';
import { Perfil } from '../../perfis/entities/perfil.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';

// Estas são as chaves de permissão (Item 2.2 do roteiro)
const ALL_PERMISSIONS = [
  // Pacientes
  { id: 'paciente:criar', descricao: 'Criar Pacientes' },
  { id: 'paciente:ler', descricao: 'Ler Pacientes' },
  { id: 'paciente:editar', descricao: 'Editar Pacientes' },
  { id: 'paciente:excluir', descricao: 'Excluir Pacientes' },
  // Consultas
  { id: 'consulta:criar', descricao: 'Criar Consultas' },
  { id: 'consulta:ler', descricao: 'Ler Consultas' },
  { id: 'consulta:editar', descricao: 'Editar Consultas (Status)' },
  // Prontuários (Médicos)
  { id: 'prontuario:criar', descricao: 'Criar Prontuários' },
  { id: 'prontuario:ler', descricao: 'Ler Prontuários' },
  { id: 'prontuario:editar', descricao: 'Editar Prontuários' },
  // Funcionários (Admin)
  { id: 'funcionario:criar', descricao: 'Criar Funcionários' },
  { id: 'funcionario:ler', descricao: 'Ler Funcionários' },
  { id: 'funcionario:editar', descricao: 'Editar Funcionários' },
  { id: 'funcionario:excluir', descricao: 'Excluir Funcionários' },
  // Configurações (Admin)
  { id: 'perfil:criar', descricao: 'Criar Perfis' },
  { id: 'perfil:ler', descricao: 'Ler Perfis' },
  { id: 'perfil:editar', descricao: 'Editar Perfis' },
  { id: 'perfil:excluir', descricao: 'Excluir Perfis' },
];

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Permissao)
    private permissaoRepo: Repository<Permissao>,
    @InjectRepository(Perfil)
    private perfilRepo: Repository<Perfil>,
    @InjectRepository(Usuario)
    private usuarioRepo: Repository<Usuario>,
  ) {}

  async runSeeds() {
    this.logger.log('Iniciando execução dos seeds...');

    // 1. Criar Permissões (só se não existirem)
    // Usamos 'upsert' para inserir ou ignorar se a 'id' (PrimaryColumn) já existir
    await this.permissaoRepo.upsert(ALL_PERMISSIONS, ['id']);
    const permissoes = await this.permissaoRepo.find();
    this.logger.log(`${permissoes.length} permissões carregadas.`);

    // 2. Criar Perfis
    const perfilAdmin = await this.criarPerfil('ADMIN', permissoes); // Todas

    // --- CORREÇÃO AQUI ---
    // Filtramos os 'undefined' ANTES de passar para a função
    const perfilMedico = await this.criarPerfil(
      'MEDICO',
      [
        permissoes.find((p) => p.id === 'paciente:ler'),
        permissoes.find((p) => p.id === 'consulta:criar'),
        permissoes.find((p) => p.id === 'consulta:ler'),
        permissoes.find((p) => p.id === 'consulta:editar'),
        permissoes.find((p) => p.id === 'prontuario:criar'),
        permissoes.find((p) => p.id === 'prontuario:ler'),
        permissoes.find((p) => p.id === 'prontuario:editar'),
      ].filter(Boolean) as Permissao[], // Filtra nulos/undefined
    );

    // --- CORREÇÃO AQUI ---
    const perfilAtendente = await this.criarPerfil(
      'ATENDENTE',
      [
        permissoes.find((p) => p.id === 'paciente:criar'),
        permissoes.find((p) => p.id === 'paciente:ler'),
        permissoes.find((p) => p.id === 'paciente:editar'),
        permissoes.find((p) => p.id === 'consulta:criar'),
        permissoes.find((p) => p.id === 'consulta:ler'),
        permissoes.find((p) => p.id === 'consulta:editar'),
      ].filter(Boolean) as Permissao[], // Filtra nulos/undefined
    );
    // --- FIM DAS CORREÇÕES ---

    // 3. Criar Usuário Admin
    await this.criarUsuarioAdmin(perfilAdmin);

    this.logger.log('Seeds executados com sucesso!');
  }

  // --- Funções Auxiliares ---

  private async criarPerfil(
    nome: string,
    permissoes: Permissao[], // Agora o array chega limpo
  ): Promise<Perfil> {
    const perfilExistente = await this.perfilRepo.findOne({
      where: { nome },
      relations: ['permissoes'],
    });

    if (perfilExistente) {
      this.logger.warn(`Perfil "${nome}" já existe. Atualizando permissões...`);
      // O array já vem filtrado, podemos atribuir diretamente
      perfilExistente.permissoes = permissoes;
      return this.perfilRepo.save(perfilExistente);
    }

    const novoPerfil = this.perfilRepo.create({
      nome,
      permissoes: permissoes, // O array já vem filtrado
    });
    this.logger.log(`Criando perfil "${nome}"...`);
    return this.perfilRepo.save(novoPerfil);
  }

  private async criarUsuarioAdmin(perfilAdmin: Perfil) {
    const emailAdmin = 'admin@local.com';
    const adminExistente = await this.usuarioRepo.findOne({
      where: { email: emailAdmin },
    });

    if (adminExistente) {
      this.logger.warn('Usuário "admin@local.com" já existe.');
      return adminExistente;
    }

    const admin = this.usuarioRepo.create({
      nome: 'Administrador Padrão',
      email: emailAdmin,
      senha: 'admin123', // A senha será criptografada pelo @BeforeInsert na entidade
      ativo: true,
      perfil: perfilAdmin,
    });

    this.logger.log('Criando usuário "admin@local.com"...');
    return this.usuarioRepo.save(admin);
  }
}
