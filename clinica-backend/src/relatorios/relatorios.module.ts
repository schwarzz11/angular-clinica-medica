import { Module } from '@nestjs/common';
import { RelatoriosService } from './services/relatorios.service';
import { RelatoriosController } from './controllers/relatorios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Paciente } from '../pacientes/entities/paciente.entity'; // 1. Importe
import { Funcionario } from '../funcionarios/entities/funcionario.entity'; // 2. Importe
import { Consulta } from '../consultas/entities/consulta.entity'; // 3. Importe

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Paciente, // 4. Adicione
      Funcionario, // 5. Adicione
      Consulta, // 6. Adicione
    ]),
  ],
  controllers: [RelatoriosController],
  providers: [RelatoriosService],
})
export class RelatoriosModule {}
