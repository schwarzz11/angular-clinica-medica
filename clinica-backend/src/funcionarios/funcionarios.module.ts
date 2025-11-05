import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Funcionario } from './entities/funcionario.entity';
import { FuncionariosService } from './services/funcionarios.service';
import { FuncionariosController } from './controllers/funcionarios.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Funcionario])],
  controllers: [FuncionariosController], // <-- Adicione
  providers: [FuncionariosService], // <-- Adicione
})
export class FuncionariosModule {}
