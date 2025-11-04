import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Paciente } from './entities/paciente.entity';
import { PacientesService } from './services/pacientes.service'; // 1. Importe
import { PacientesController } from './controllers/pacientes.controller'; // 2. Importe

@Module({
  imports: [TypeOrmModule.forFeature([Paciente])],
  controllers: [PacientesController], // 3. Adicione o Controller
  providers: [PacientesService], // 4. Adicione o Service
})
export class PacientesModule {}
