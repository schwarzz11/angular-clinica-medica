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
import { FuncionariosService } from '../services/funcionarios.service';
import { CreateFuncionarioDto } from '../dto/create-funcionario.dto';
import { UpdateFuncionarioDto } from '../dto/update-funcionario.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissaoGuard } from '../../auth/guards/permissao.guard';
import { Permissao } from '../../auth/decorators/permissao.decorator';

@Controller('funcionarios') // Rota: /api/v1/funcionarios
@UseGuards(JwtAuthGuard, PermissaoGuard)
export class FuncionariosController {
  constructor(private readonly funcionariosService: FuncionariosService) {}

  @Post()
  @Permissao('funcionario:criar') // <-- RBAC
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDto: CreateFuncionarioDto) {
    return this.funcionariosService.create(createDto);
  }

  @Get()
  @Permissao('funcionario:ler') // <-- RBAC
  findAll(@Query() params: any) {
    return this.funcionariosService.findAll(params);
  }

  @Get(':id')
  @Permissao('funcionario:ler') // <-- RBAC
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.funcionariosService.findOne(id);
  }

  @Put(':id')
  @Permissao('funcionario:editar') // <-- RBAC
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateFuncionarioDto,
  ) {
    return this.funcionariosService.update(id, updateDto);
  }

  @Delete(':id')
  @Permissao('funcionario:excluir') // <-- RBAC
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.funcionariosService.remove(id);
  }
}
