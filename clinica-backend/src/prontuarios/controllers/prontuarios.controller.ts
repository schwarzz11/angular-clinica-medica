import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Request, // <-- Importe o Request
} from '@nestjs/common';
import { ProntuariosService } from '../services/prontuarios.service';
import { CreateProntuarioDto } from '../dto/create-prontuario.dto';
import { UpdateProntuarioDto } from '../dto/update-prontuario.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissaoGuard } from '../../auth/guards/permissao.guard';
import { Permissao } from '../../auth/decorators/permissao.decorator';
// --- CORREÇÃO AQUI ---
import type { RequestWithUser } from '../../auth/guards/permissao.guard'; // Importe a interface que criamos

@Controller('prontuarios') // Rota: /api/v1/prontuarios
@UseGuards(JwtAuthGuard, PermissaoGuard)
export class ProntuariosController {
  constructor(private readonly prontuariosService: ProntuariosService) {}

  @Post()
  @Permissao('prontuario:criar') // RBAC (Médico)
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createDto: CreateProntuarioDto,
    @Request() req: RequestWithUser, // <-- Pega a requisição
  ) {
    // Passa o DTO e o usuário logado (para auditoria)
    return this.prontuariosService.create(createDto, req.user);
  }

  @Get()
  @Permissao('prontuario:ler') // RBAC
  findAll() {
    return this.prontuariosService.findAll();
  }

  @Get(':id')
  @Permissao('prontuario:ler') // RBAC
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.prontuariosService.findOne(id);
  }

  @Put(':id')
  @Permissao('prontuario:editar') // RBAC
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateProntuarioDto,
    @Request() req: RequestWithUser, // <-- Pega a requisição
  ) {
    // Passa o ID, o DTO e o usuário logado (para auditoria)
    return this.prontuariosService.update(id, updateDto, req.user);
  }

  // DELETE não é implementado (Item 6.5)
}
