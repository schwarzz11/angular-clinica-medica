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
import { ConveniosService } from '../services/convenios.service';
import { CreateConvenioDto } from '../dto/create-convenio.dto';
import { UpdateConvenioDto } from '../dto/update-convenio.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissaoGuard } from '../../auth/guards/permissao.guard';
import { Permissao } from '../../auth/decorators/permissao.decorator';

@Controller('convenios') // Rota: /api/v1/convenios
@UseGuards(JwtAuthGuard, PermissaoGuard)
export class ConveniosController {
  constructor(private readonly conveniosService: ConveniosService) {}

  @Post()
  @Permissao('paciente:criar') // Apenas quem pode criar paciente, pode criar convênio
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDto: CreateConvenioDto) {
    return this.conveniosService.create(createDto);
  }

  @Get()
  @Permissao('paciente:ler') // Todos logados (com permissão básica) podem ler
  findAll() {
    return this.conveniosService.findAll();
  }

  @Get(':id')
  @Permissao('paciente:ler') // Todos logados podem ler
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.conveniosService.findOne(id);
  }

  @Put(':id')
  @Permissao('paciente:editar') // Apenas quem pode editar paciente
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateConvenioDto,
  ) {
    return this.conveniosService.update(id, updateDto);
  }

  @Delete(':id')
  @Permissao('paciente:excluir') // Apenas quem pode excluir paciente
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.conveniosService.remove(id);
  }
}
