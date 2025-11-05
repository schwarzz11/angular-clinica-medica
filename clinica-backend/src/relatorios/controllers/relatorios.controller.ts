import { Controller, Get, UseGuards } from '@nestjs/common';
import { RelatoriosService } from '../services/relatorios.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissaoGuard } from '../../auth/guards/permissao.guard';
import { Permissao } from '../../auth/decorators/permissao.decorator';

@Controller('relatorios') // Rota: /api/v1/relatorios
@UseGuards(JwtAuthGuard, PermissaoGuard)
export class RelatoriosController {
  constructor(private readonly relatoriosService: RelatoriosService) {}

  @Get('kpis')
  @Permissao('relatorio:ler') // RBAC (Usando a permissão que criamos)
  getKpis() {
    return this.relatoriosService.getKpis();
  }
}
