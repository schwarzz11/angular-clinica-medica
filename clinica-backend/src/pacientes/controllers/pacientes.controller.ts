import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { PacientesService } from '../services/pacientes.service';
import { CreatePacienteDto } from '../dto/create-paciente.dto';
import { UpdatePacienteDto } from '../dto/update-paciente.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'; // 1. O "Segurança" de Login
import { PermissaoGuard } from '../../auth/guards/permissao.guard'; // 2. O "Segurança" de RBAC
import { Permissao } from '../../auth/decorators/permissao.decorator'; // 3. O nosso @Decorator

@Controller('pacientes') // Rota: /api/v1/pacientes
@UseGuards(JwtAuthGuard, PermissaoGuard) // <-- PROTEGE O CONTROLLER INTEIRO
export class PacientesController {
  constructor(private readonly pacientesService: PacientesService) {}

  @Post()
  @Permissao('paciente:criar') // <-- RBAC: Só pode criar se tiver a permissão
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createPacienteDto: CreatePacienteDto) {
    return this.pacientesService.create(createPacienteDto);
  }

  @Get()
  @Permissao('paciente:ler') // <-- RBAC
  findAll(@Query() params: any) {
    // params (ex: ?page=1&size=10&busca=joao)
    return this.pacientesService.findAll(params);
  }

  @Get(':id')
  @Permissao('paciente:ler') // <-- RBAC
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pacientesService.findOne(id);
  }

  @Put(':id')
  @Permissao('paciente:editar') // <-- RBAC
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePacienteDto: UpdatePacienteDto,
  ) {
    return this.pacientesService.update(id, updatePacienteDto);
  }

  @Delete(':id')
  @Permissao('paciente:excluir') // <-- RBAC
  @HttpCode(HttpStatus.NO_CONTENT) // Retorna 204 No Content (sucesso)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.pacientesService.remove(id);
  }
}
