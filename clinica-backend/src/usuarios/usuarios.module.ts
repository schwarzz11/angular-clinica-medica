import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { UsuariosService } from './services/usuarios.service'; // 1. Importe

@Module({
  imports: [TypeOrmModule.forFeature([Usuario])],
  providers: [UsuariosService], // 2. Adicione em providers
  exports: [UsuariosService], // 3. EXPORTE o serviço para o AuthModule usar
})
export class UsuariosModule {}
