import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

// O class-validator usa os decorators para validar o payload
// (Isso funciona por causa do ValidationPipe que colocamos no main.ts)
export class LoginDto {
  @IsEmail({}, { message: 'O e-mail informado é inválido.' })
  @IsNotEmpty({ message: 'O campo e-mail é obrigatório.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'O campo senha é obrigatório.' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  senha: string;
}
