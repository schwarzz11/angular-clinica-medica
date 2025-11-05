import {
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

// --- Sub-DTOs ---
class CreateReceitaDto {
  @IsString()
  @IsNotEmpty()
  texto: string;
}

class CreateAtestadoDto {
  @IsString()
  @IsNotEmpty()
  texto: string;

  @IsInt()
  @IsPositive()
  @IsOptional()
  diasAfastamento: number;
}

class CreateAnexoDto {
  @IsString()
  @IsNotEmpty()
  nomeArquivo: string;

  @IsString()
  @IsNotEmpty()
  url: string; // Em um projeto real, isso viria de um upload

  @IsString()
  @IsNotEmpty()
  tipo: 'PDF' | 'IMG' | 'OUTRO';
}
// --- Fim dos Sub-DTOs ---

export class CreateProntuarioDto {
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  consultaId: number; // O ID da consulta à qual este prontuário pertence

  @IsString()
  @IsOptional()
  resumo: string;

  // O TypeORM permite criar entidades aninhadas (cascade insert)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateReceitaDto)
  @IsOptional()
  receitas: CreateReceitaDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAtestadoDto)
  @IsOptional()
  atestados: CreateAtestadoDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAnexoDto)
  @IsOptional()
  anexos: CreateAnexoDto[];
}
