import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Perfil } from './entities/perfil.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Perfil]), // <-- Adicione esta linha
  ],
})
export class PerfisModule {}
