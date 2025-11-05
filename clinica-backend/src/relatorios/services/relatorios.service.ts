import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Paciente } from '../../pacientes/entities/paciente.entity';
import { Repository } from 'typeorm';
import { Consulta } from '../../consultas/entities/consulta.entity';
import { Funcionario } from '../../funcionarios/entities/funcionario.entity';

// Interface para a resposta do KPI
export interface KpiResponse {
  totalPacientes: number;
  totalMedicos: number;
  totalConsultasAgendadas: number;
  totalConsultasConcluidas: number;
  totalConsultasCanceladas: number;
}

@Injectable()
export class RelatoriosService {
  constructor(
    // Precisamos de acesso a vários repositórios para os KPIs
    @InjectRepository(Paciente)
    private pacientesRepository: Repository<Paciente>,
    @InjectRepository(Funcionario)
    private funcionariosRepository: Repository<Funcionario>,
    @InjectRepository(Consulta)
    private consultasRepository: Repository<Consulta>,
  ) {}

  /**
   * Coleta e retorna os principais KPIs do sistema (Item 4)
   */
  async getKpis(): Promise<KpiResponse> {
    const totalPacientes = await this.pacientesRepository.count();

    const totalMedicos = await this.funcionariosRepository.count({
      where: { tipo: 'MEDICO' },
    });

    const totalConsultasAgendadas = await this.consultasRepository.count({
      where: { status: 'AGENDADA' },
    });

    const totalConsultasConcluidas = await this.consultasRepository.count({
      where: { status: 'CONCLUIDA' },
    });

    const totalConsultasCanceladas = await this.consultasRepository.count({
      where: { status: 'CANCELADA' },
    });

    return {
      totalPacientes,
      totalMedicos,
      totalConsultasAgendadas,
      totalConsultasConcluidas,
      totalConsultasCanceladas,
    };
  }
}
