import { Module } from '@nestjs/common';
import { SeedService } from './services/seed.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permissao } from '../permissoes/entities/permissao.entity';
import { Perfil } from '../perfis/entities/perfil.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Module({
  imports: [
    // Importamos as entidades que o SeedService vai manipular
    TypeOrmModule.forFeature([Permissao, Perfil, Usuario]),
  ],
  providers: [SeedService], // Registramos o SeedService
  exports: [SeedService], // Exportamos para o AppModule usar
})
export class SeedsModule {}
