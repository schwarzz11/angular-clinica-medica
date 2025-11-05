import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consulta } from './entities/consulta.entity';
import { ConsultasService } from './services/consultas.service';
import { ConsultasController } from './controllers/consultas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Consulta])],
  controllers: [ConsultasController], // <-- Adicione
  providers: [ConsultasService], // <-- Adicione
})
export class ConsultasModule {}
