import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Funcionario } from './entities/funcionario.entity';
import { Especialidade } from '../especialidades/entities/especialidade.entity';
import { FuncionariosService } from './services/funcionarios.service';
import { FuncionariosController } from './controllers/funcionarios.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Funcionario, Especialidade])],
  controllers: [FuncionariosController],
  providers: [FuncionariosService],
})
export class FuncionariosModule {}
