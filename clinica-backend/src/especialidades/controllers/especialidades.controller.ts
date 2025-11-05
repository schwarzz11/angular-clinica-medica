import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { EspecialidadesService } from '../services/especialidades.service';
import { CreateEspecialidadeDto } from '../dto/create-especialidade.dto';
import { UpdateEspecialidadeDto } from '../dto/update-especialidade.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissaoGuard } from '../../auth/guards/permissao.guard';
import { Permissao } from '../../auth/decorators/permissao.decorator';

@Controller('especialidades') // Rota: /api/v1/especialidades
@UseGuards(JwtAuthGuard, PermissaoGuard)
export class EspecialidadesController {
  constructor(
    private readonly especialidadesService: EspecialidadesService,
  ) {}

  @Post()
  @Permissao('funcionario:criar') // Apenas quem pode criar funcionário, pode criar especialidade
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDto: CreateEspecialidadeDto) {
    return this.especialidadesService.create(createDto);
  }

  @Get()
  @Permissao('paciente:ler') // Todos logados (com permissão básica) podem ler
  findAll() {
    return this.especialidadesService.findAll();
  }

  @Get(':id')
  @Permissao('paciente:ler') // Todos logados podem ler
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.especialidadesService.findOne(id);
  }

  @Put(':id')
  @Permissao('funcionario:editar') // Apenas quem pode editar funcionário
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateEspecialidadeDto,
  ) {
    return this.especialidadesService.update(id, updateDto);
  }

  @Delete(':id')
  @Permissao('funcionario:excluir') // Apenas quem pode excluir funcionário
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.especialidadesService.remove(id);
  }
}