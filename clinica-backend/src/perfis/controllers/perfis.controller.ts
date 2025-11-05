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
import { PerfisService } from '../services/perfis.service';
import { CreatePerfilDto } from '../dto/create-perfil.dto';
import { UpdatePerfilDto } from '../dto/update-perfil.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissaoGuard } from '../../auth/guards/permissao.guard';
import { Permissao } from '../../auth/decorators/permissao.decorator';

@Controller('perfis') // Rota: /api/v1/perfis
@UseGuards(JwtAuthGuard, PermissaoGuard)
export class PerfisController {
  constructor(private readonly perfisService: PerfisService) {}

  @Post()
  @Permissao('perfil:criar') // RBAC
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDto: CreatePerfilDto) {
    return this.perfisService.create(createDto);
  }

  @Get()
  @Permissao('perfil:ler') // RBAC
  findAll() {
    return this.perfisService.findAll();
  }

  @Get(':id')
  @Permissao('perfil:ler') // RBAC
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.perfisService.findOne(id);
  }

  @Put(':id')
  @Permissao('perfil:editar') // RBAC
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdatePerfilDto,
  ) {
    return this.perfisService.update(id, updateDto);
  }

  @Delete(':id')
  @Permissao('perfil:excluir') // RBAC
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.perfisService.remove(id);
  }
}
