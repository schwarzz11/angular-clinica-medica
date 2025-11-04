import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy'; // 1. Importe

export const jwtConstants = {
  secret: 'sua-chave-secreta-super-dificil-de-adivinhar-123456',
};

@Module({
  imports: [
    UsuariosModule,
    PassportModule.register({ defaultStrategy: 'jwt' }), // 2. Defina a estratégia padrão
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, JwtStrategy], // 3. Adicione JwtStrategy aos providers
  controllers: [AuthController],
  exports: [PassportModule, JwtStrategy], // 4. Exporte para outros módulos usarem
})
export class AuthModule {}
