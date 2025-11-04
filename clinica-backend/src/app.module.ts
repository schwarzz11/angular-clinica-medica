import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { PerfisModule } from './perfis/perfis.module';
import { PermissoesModule } from './permissoes/permissoes.module';
import { PacientesModule } from './pacientes/pacientes.module';
import { FuncionariosModule } from './funcionarios/funcionarios.module';
import { EspecialidadesModule } from './especialidades/especialidades.module';
import { ConveniosModule } from './convenios/convenios.module';
import { ConsultasModule } from './consultas/consultas.module';
import { ProntuariosModule } from './prontuarios/prontuarios.module';
import { RelatoriosModule } from './relatorios/relatorios.module';
import { UploadsModule } from './uploads/uploads.module';
import { SeedsModule } from './seeds/seeds.module';

@Module({
  imports: [
    // 1. Módulo de Configuração
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 2. Módulo de Métricas (Prometheus)
    PrometheusModule.register(),

    // 3. Módulo TypeORM (Conexão com o Banco)
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'admin123',
      database: 'clinica_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Lembre-se: apenas para dev
    }),

    // 4. Módulos de Autenticação e Negócio
    AuthModule,
    UsuariosModule,
    PerfisModule,
    PermissoesModule,
    PacientesModule,
    FuncionariosModule,
    EspecialidadesModule,
    ConveniosModule,
    ConsultasModule,
    ProntuariosModule,
    RelatoriosModule,
    UploadsModule,
    SeedsModule, // Módulo de Seeds
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
