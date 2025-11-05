import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  IsEnum,
  ValidateIf, // Importa o validador condicional
  IsInt,
  IsPositive,
} from 'class-validator';
// --- CORREÇÃO AQUI ---
import type { TipoFuncionario } from '../entities/funcionario.entity';

export class CreateFuncionarioDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  @MaxLength(100)
  nome: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  telefone: string;

  @IsEnum(['MEDICO', 'ATENDENTE', 'OUTRO'], {
    message: 'O tipo deve ser MEDICO, ATENDENTE ou OUTRO.',
  })
  @IsNotEmpty({ message: 'O tipo é obrigatório.' })
  tipo: TipoFuncionario;

  // --- REGRA DE NEGÓCIO (Item 6.6) ---
  @IsString()
  @IsNotEmpty({ message: 'O CRM é obrigatório para médicos.' })
  @MaxLength(20)
  @ValidateIf((obj) => obj.tipo === 'MEDICO') // <-- SÓ VALIDA SE O CAMPO 'tipo' FOR 'MEDICO'
  crm: string;

  // ID do usuário do sistema a ser vinculado (opcional)
  @IsInt()
  @IsPositive()
  @IsOptional()
  usuarioId: number;
}
