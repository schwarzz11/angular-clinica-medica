import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prontuario } from './entities/prontuario.entity';
import { Receita } from './entities/receita.entity';
import { Atestado } from './entities/atestado.entity';
import { Anexo } from './entities/anexo.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Prontuario, // <-- Adicione
      Receita, // <-- Adicione
      Atestado, // <-- Adicione
      Anexo, // <-- Adicione
    ]),
  ],
})
export class ProntuariosModule {}
