import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permissao } from './entities/permissao.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Permissao]), // <-- Adicione esta linha
  ],
  // Vamos adicionar controllers e providers aqui mais tarde
})
export class PermissoesModule {}
