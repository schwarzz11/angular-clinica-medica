import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Convenio } from './entities/convenio.entity';
import { ConveniosService } from './services/convenios.service';
import { ConveniosController } from './controllers/convenios.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Convenio])],
  controllers: [ConveniosController], // <-- Adicione
  providers: [ConveniosService], // <-- Adicione
})
export class ConveniosModule {}
