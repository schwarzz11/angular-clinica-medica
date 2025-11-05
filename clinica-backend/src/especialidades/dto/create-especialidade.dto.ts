import { IsString, IsNotEmpty, IsOptional, MaxLength, IsBoolean } from 'class-validator';

export class CreateEspecialidadeDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  @MaxLength(100)
  nome: string;

  @IsString()
  @IsOptional()
  descricao: string;

  @IsBoolean()
  @IsOptional() // Se não for enviado, o 'default: true' da entidade assume
  ativa: boolean;
}