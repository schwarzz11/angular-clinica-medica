import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Funcionario } from './entities/funcionario.entity'; // Importe

@Module({
  imports: [
    TypeOrmModule.forFeature([Funcionario]), // <-- AdIONE esta linha
  ],
})
export class FuncionariosModule {}
