import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import type { StatusConsulta, TipoConsulta } from '../entities/consulta.entity';

export class CreateConsultaDto {
  @IsDateString(
    {},
    { message: 'A dataHora deve estar no formato ISO 8601 (com timezone).' },
  )
  @IsNotEmpty({ message: 'A data e hora são obrigatórias.' })
  dataHora: string; // Ex: "2025-10-30T14:30:00-03:00"

  @IsInt()
  @IsPositive({ message: 'O ID do paciente deve ser um número positivo.' })
  pacienteId: number;

  @IsInt()
  @IsPositive({ message: 'O ID do médico deve ser um número positivo.' })
  medicoId: number;

  @IsInt()
  @IsPositive({ message: 'O ID da especialidade deve ser um número positivo.' })
  especialidadeId: number;

  @IsEnum(['RETORNO', 'AVALIACAO', 'EXAME'], {
    message: 'O tipo deve ser RETORNO, AVALIACAO ou EXAME.',
  })
  @IsOptional()
  tipo: TipoConsulta;

  @IsString()
  @IsOptional()
  observacoes: string;
}
