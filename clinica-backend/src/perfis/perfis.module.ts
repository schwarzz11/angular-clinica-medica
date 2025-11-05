import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Perfil } from './entities/perfil.entity';
import { PerfisService } from './services/perfis.service';
import { PerfisController } from './controllers/perfis.controller';
import { Permissao } from '../permissoes/entities/permissao.entity'; // 1. Importe

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Perfil,
      Permissao, // 2. Adicione Permissao aqui
    ]),
  ],
  controllers: [PerfisController],
  providers: [PerfisService],
})
export class PerfisModule {}
