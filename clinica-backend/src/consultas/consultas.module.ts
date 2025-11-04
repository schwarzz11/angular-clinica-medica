import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consulta } from './entities/consulta.entity'; // Importe

@Module({
  imports: [
    TypeOrmModule.forFeature([Consulta]), // <-- Adicione esta linha
  ],
})
export class ConsultasModule {}
