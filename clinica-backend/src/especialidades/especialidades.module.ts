import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Especialidade } from './entities/especialidade.entity';
import { EspecialidadesService } from './services/especialidades.service';
import { EspecialidadesController } from './controllers/especialidades.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Especialidade])],
  controllers: [EspecialidadesController], // <-- Adicione
  providers: [EspecialidadesService], // <-- Adicione
})
export class EspecialidadesModule {}
