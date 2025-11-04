import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsDateString,
  ValidateNested, // <-- A VÍRGULA DUPLA FOI REMOVIDA DAQUI
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

// DTO para o Endereço embutido (necessário para o @ValidateNested)
// A entidade 'Endereco' não pode ser usada aqui pois ela é do TypeORM,
// precisamos de uma classe DTO específica para o class-validator.
export class EnderecoDto {
  @IsString()
  @IsOptional()
  @MaxLength(9)
  cep: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  logradouro: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  numero: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  complemento: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  bairro: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  cidade: string;

  @IsString()
  @IsOptional()
  @MaxLength(2)
  uf: string;
}

export class CreatePacienteDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  @MaxLength(100)
  nome: string;

  @IsString()
  @IsNotEmpty({ message: 'O CPF é obrigatório.' })
  @MaxLength(14) // "123.456.789-00"
  cpf: string;

  @IsString()
  @IsOptional()
  @MaxLength(18)
  cns: string;

  @IsEmail({}, { message: 'O e-mail informado é inválido.' })
  @IsOptional()
  @MaxLength(100)
  email: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  telefone: string;

  @IsDateString(
    {},
    { message: 'A data de nascimento deve estar no formato AAAA-MM-DD.' },
  )
  @IsNotEmpty({ message: 'A data de nascimento é obrigatória.' })
  dataNascimento: string;

  @IsOptional()
  @ValidateNested() // Diz ao class-validator para validar o objeto Endereco
  @Type(() => EnderecoDto) // Diz como transformar o JSON em classe
  endereco: EnderecoDto;
}
