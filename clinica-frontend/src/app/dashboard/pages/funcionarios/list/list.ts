import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FuncionariosService } from '../services/funcionarios';
import { Funcionario } from '../../../../core/models';
import { MessageService } from 'primeng/api';

// --- IMPORTS CORRETOS (NgModules) ---
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TableModule, // MÓDULO
    ButtonModule,
    InputTextModule,
    ToastModule,
    TagModule,
  ],
  templateUrl: './list.html',
  styleUrl: './list.scss',
  providers: [MessageService],
})
export class ListComponent {
  // (A lógica de dados reais (que eu te passei antes)
  // deve ser colocada aqui, mas vamos primeiro fazer a tela aparecer)

  // Usando os Mocks para garantir que a tela apareça
  funcionarios: Funcionario[] = [];
  constructor() {
    this.funcionarios = [
      { id: 1, nome: 'Dr. João (Mock)', tipo: 'MEDICO', crm: '12345-MG' } as Funcionario,
      { id: 2, nome: 'Maria Atendente (Mock)', tipo: 'ATENDENTE' } as Funcionario,
    ];
  }
}
