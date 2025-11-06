import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FuncionariosService, RespostaPaginada } from '../services/funcionarios'; //
import { Funcionario } from '../../../../core/models';
import { MessageService } from 'primeng/api';

// --- IMPORTS CORRETOS (NgModules) ---
import { TableModule, TableLazyLoadEvent } from 'primeng/table'; // <-- CORREÇÃO: Importar TableLazyLoadEvent daqui
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';

// --- IMPORTAR DIRETIVA RBAC ---
import { HasPermissionDirective } from '../../../../shared/directives/has-permission'; //

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TableModule,
    ButtonModule,
    InputTextModule,
    ToastModule,
    TagModule,
    HasPermissionDirective, //
  ],
  templateUrl: './list.html',
  styleUrl: './list.scss',
  providers: [MessageService],
})
export class ListComponent implements OnInit {
  // Injeção de dependências
  private readonly funcionariosService = inject(FuncionariosService);
  private readonly messageService = inject(MessageService);

  // Propriedades de estado
  funcionarios: Funcionario[] = [];
  loading = false;
  totalRecords = 0;
  rows = 10; // Define o tamanho da página

  constructor() {
    // Construtor limpo
  }

  ngOnInit(): void {
    // O (onLazyLoad) da tabela será disparado automaticamente na inicialização.
  }

  /**
   * Método chamado pelo (onLazyLoad) da p-table.
   * Ele cuida da paginação, ordenação e filtros.
   */
  carregarFuncionarios(event: TableLazyLoadEvent): void {
    // <-- CORREÇÃO: Usar o tipo TableLazyLoadEvent
    this.loading = true;

    // A lógica de ?? this.rows já trata 'null' e 'undefined' corretamente.
    const page = (event.first ?? 0) / (event.rows ?? this.rows) + 1;
    const size = event.rows ?? this.rows;

    // Simplificado - Adicionar lógica de filtro (event.filters) e ordenação (event.sortField) depois
    const busca = '';

    this.funcionariosService.listar(page, size, busca).subscribe({
      next: (resposta: RespostaPaginada) => {
        this.funcionarios = resposta.items;
        this.totalRecords = resposta.total;
        this.loading = false;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível carregar os funcionários.',
        });
        this.loading = false;
      },
    });
  }
}
