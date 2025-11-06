// Chaves de permissão (do backend SeedService)
// (Expandido para incluir todas as permissões do Blueprint)
export type PerfilKey =
  // Pacientes
  | 'paciente:criar'
  | 'paciente:ler'
  | 'paciente:editar'
  | 'paciente:excluir'
  // Consultas
  | 'consulta:criar'
  | 'consulta:ler'
  | 'consulta:editar'
  | 'consulta:excluir' // Adicionado
  // Prontuários
  | 'prontuario:criar'
  | 'prontuario:ler'
  | 'prontuario:editar'
  // Funcionários
  | 'funcionario:criar'
  | 'funcionario:ler'
  | 'funcionario:editar'
  | 'funcionario:excluir'
  // Perfis
  | 'perfil:criar'
  | 'perfil:ler'
  | 'perfil:editar'
  | 'perfil:excluir'
  // Especialidades (Adicionado)
  | 'especialidade:criar'
  | 'especialidade:ler'
  | 'especialidade:editar'
  | 'especialidade:excluir'
  // Convênios (Adicionado)
  | 'convenio:criar'
  | 'convenio:ler'
  | 'convenio:editar'
  | 'convenio:excluir'
  // Outros
  | 'relatorio:ler'
  | 'configuracao:ler'
  | 'configuracao:editar';

// O objeto que o backend retorna no /login (Item 7)
export interface UsuarioSessao {
  id: number;
  nome: string;
  email: string;
  perfil: string;
  permissoes: PerfilKey[];
}

// O payload do /login
export interface LoginResponse {
  token: string;
  user: UsuarioSessao;
}

// Interfaces das Entidades (Item 2.2)
export interface Endereco {
  cep?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade: string;
  uf: string;
}

export interface Paciente {
  id: number;
  nome: string;
  cpf: string;
  cns?: string;
  email?: string;
  telefone?: string;
  dataNascimento: string;
  endereco?: Endereco;
  createdAt?: string;
  updatedAt?: string;
}

export type TipoFuncionario = 'MEDICO' | 'ATENDENTE' | 'OUTRO';

export interface Especialidade {
  id: number;
  nome: string;
  descricao?: string;
  ativa: boolean;
}

export interface Funcionario {
  id: number;
  nome: string;
  telefone?: string;
  tipo: TipoFuncionario;
  crm?: string;
  usuarioId?: number;
  especialidades?: Especialidade[];
}

// (Adicione outras interfaces de entidade (Convenio, Consulta, etc.) aqui conforme necessário)
