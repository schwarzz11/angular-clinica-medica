import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prontuario } from './entities/prontuario.entity';
import { Receita } from './entities/receita.entity';
import { Atestado } from './entities/atestado.entity';
import { Anexo } from './entities/anexo.entity';
import { ProntuariosService } from './services/prontuarios.service';
import { ProntuariosController } from './controllers/prontuarios.controller';
import { Consulta } from '../consultas/entities/consulta.entity'; // 1. Importe

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Prontuario,
      Receita,
      Atestado,
      Anexo,
      Consulta, // 2. Adicione Consulta aqui
    ]),
  ],
  controllers: [ProntuariosController],
  providers: [ProntuariosService],
})
export class ProntuariosModule {}
