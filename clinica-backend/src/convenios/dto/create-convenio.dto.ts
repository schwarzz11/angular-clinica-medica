import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  IsBoolean,
} from 'class-validator';

export class CreateConvenioDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  @MaxLength(100)
  nome: string;

  @IsString()
  @IsOptional()
  regras: string;

  @IsBoolean()
  @IsOptional() // Se não for enviado, o 'default: true' da entidade assume
  ativo: boolean;
}
