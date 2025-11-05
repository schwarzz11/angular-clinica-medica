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
import { ConsultasService } from '../services/consultas.service';
import { CreateConsultaDto } from '../dto/create-consulta.dto';
import { UpdateConsultaDto } from '../dto/update-consulta.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissaoGuard } from '../../auth/guards/permissao.guard';
import { Permissao } from '../../auth/decorators/permissao.decorator';

@Controller('consultas') // Rota: /api/v1/consultas
@UseGuards(JwtAuthGuard, PermissaoGuard)
export class ConsultasController {
  constructor(private readonly consultasService: ConsultasService) {}

  @Post()
  @Permissao('consulta:criar') // RBAC
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDto: CreateConsultaDto) {
    return this.consultasService.create(createDto);
  }

  @Get()
  @Permissao('consulta:ler') // RBAC
  findAll() {
    return this.consultasService.findAll();
  }

  @Get(':id')
  @Permissao('consulta:ler') // RBAC
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.consultasService.findOne(id);
  }

  // Este endpoint é usado para Reagendar, Confirmar, Cancelar, Concluir, etc.
  @Put(':id')
  @Permissao('consulta:editar') // RBAC
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateConsultaDto,
  ) {
    return this.consultasService.update(id, updateDto);
  }

  // Excluir consulta é perigoso (perda de histórico).
  // Só o Admin pode fazer isso.
  @Delete(':id')
  @Permissao('funcionario:excluir') // <-- Permissão de alto nível que o Admin possui
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.consultasService.remove(id);
  }
}
