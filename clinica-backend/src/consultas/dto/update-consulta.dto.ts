import { IsEnum, IsOptional, IsString, IsDateString } from 'class-validator';
import type { StatusConsulta, TipoConsulta } from '../entities/consulta.entity';

export class UpdateConsultaDto {
  @IsDateString(
    {},
    { message: 'A dataHora deve estar no formato ISO 8601 (com timezone).' },
  )
  @IsOptional()
  dataHora: string;

  @IsEnum(['RETORNO', 'AVALIACAO', 'EXAME'], {
    message: 'O tipo deve ser RETORNO, AVALIACAO ou EXAME.',
  })
  @IsOptional()
  tipo: TipoConsulta;

  @IsEnum(
    ['AGENDADA', 'CONFIRMADA', 'CANCELADA', 'CONCLUIDA', 'NAO_COMPARECEU'],
    { message: 'O status informado é inválido.' },
  )
  @IsOptional()
  status: StatusConsulta;

  @IsString()
  @IsOptional()
  observacoes: string;
}
