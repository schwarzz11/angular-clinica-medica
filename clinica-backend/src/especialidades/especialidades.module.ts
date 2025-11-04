import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Especialidade } from './entities/especialidade.entity'; // Importe

@Module({
  imports: [
    TypeOrmModule.forFeature([Especialidade]), // <-- Adicione esta linha
  ],
})
export class EspecialidadesModule {}
