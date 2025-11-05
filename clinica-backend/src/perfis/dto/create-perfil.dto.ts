import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';

export class CreatePerfilDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  @MaxLength(50)
  nome: string;

  @IsArray({ message: 'O campo permissões deve ser um array de IDs.' })
  @IsString({ each: true, message: 'Cada permissão deve ser uma string (ID).' })
  @ArrayNotEmpty({ message: 'Um perfil deve ter pelo menos uma permissão.' })
  permissoesIds: string[]; // Ex: ['paciente:criar', 'paciente:ler']
}
