import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Convenio } from './entities/convenio.entity'; // Importe

@Module({
  imports: [
    TypeOrmModule.forFeature([Convenio]), // <-- Adicione esta linha
  ],
})
export class ConveniosModule {}
