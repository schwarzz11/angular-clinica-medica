// REMOVA AS PRÓXIMAS 2 LINHAS
// import { PartialType } from '@nestjs/mapped-types';
// import { CreatePerfilDto } from './create-perfil.dto';

import {
  IsArray,
  IsString,
  ArrayNotEmpty,
  IsOptional,
  MaxLength,
} from 'class-validator';

// A classe foi reescrita manualmente, então não precisamos dos imports acima.
export class UpdatePerfilDto {
  @IsString()
  @IsOptional()
  @MaxLength(50)
  nome: string;

  @IsArray({ message: 'O campo permissões deve ser um array de IDs.' })
  @IsString({ each: true, message: 'Cada permissão deve ser uma string (ID).' })
  @ArrayNotEmpty({ message: 'Um perfil deve ter pelo menos uma permissão.' })
  @IsOptional()
  permissoesIds: string[];
}
