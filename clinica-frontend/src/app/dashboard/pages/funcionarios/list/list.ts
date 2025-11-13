import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FuncionariosService, RespostaPaginada } from '../services/funcionarios';
import { EspecialidadesService } from '../services/especialidades.service';
import { Funcionario, Especialidade } from '../../../../core/models';
import { MessageService, ConfirmationService } from 'primeng/api';

// --- IMPORTS CORRETOS (NgModules) ---
import { TableModule, TableLazyLoadEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';

// --- IMPORTAR DIRETIVA RBAC ---
import { HasPermissionDirective } from '../../../../shared/directives/has-permission';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    ToastModule,
    TagModule,
    CardModule,
    DialogModule,
    ConfirmDialogModule,
    TooltipModule,
    HasPermissionDirective,
  ],
  templateUrl: './list.html',
  styleUrl: './list.scss',
  providers: [MessageService, ConfirmationService],
})
export class ListComponent implements OnInit {
  // Injeção de dependências
  private readonly funcionariosService = inject(FuncionariosService);
  private readonly especialidadesService = inject(EspecialidadesService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly fb = inject(FormBuilder);

  // Propriedades de estado
  funcionarios: Funcionario[] = [];
  loading = false;
  totalRecords = 0;
  rows = 10;
  busca = '';

  // Modal
  displayModal = false;
  isEdit = false;
  funcionarioForm!: FormGroup;
  tiposFuncionario: { label: string; value: string }[] = [
    { label: 'Médico', value: 'MEDICO' },
    { label: 'Atendente', value: 'ATENDENTE' },
    { label: 'Outro', value: 'OUTRO' },
  ];
  especialidades: Especialidade[] = [];
  especialidadesSelecionadas: Especialidade[] = [];
  funcionarioEditando: Funcionario | null = null;

  constructor() {
    this.inicializarFormulario();
  }

  ngOnInit(): void {
    this.carregarEspecialidades();
  }

  private inicializarFormulario(): void {
    this.funcionarioForm = this.fb.group({
      nome: ['', [Validators.required, Validators.maxLength(100)]],
      tipo: ['', [Validators.required]],
      crm: [''],
      telefone: ['', [Validators.maxLength(20)]],
      usuarioId: [null],
      especialidadeIds: [[]],
    });

    // Validação dinâmica do CRM
    this.funcionarioForm.get('tipo')?.valueChanges.subscribe((tipo) => {
      const crmControl = this.funcionarioForm.get('crm');
      if (tipo === 'MEDICO') {
        crmControl?.setValidators([Validators.required, Validators.maxLength(20)]);
      } else {
        crmControl?.clearValidators();
        crmControl?.setValue('');
      }
      crmControl?.updateValueAndValidity();
    });
  }

  private carregarEspecialidades(): void {
    this.especialidadesService.listar().subscribe({
      next: (especialidades) => {
        this.especialidades = especialidades.filter((e) => e.ativa);
      },
      error: () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Atenção',
          detail: 'Não foi possível carregar as especialidades.',
        });
      },
    });
  }

  /**
   * Método chamado pelo (onLazyLoad) da p-table.
   */
  carregarFuncionarios(event: TableLazyLoadEvent): void {
    this.loading = true;

    const page = (event.first ?? 0) / (event.rows ?? this.rows) + 1;
    const size = event.rows ?? this.rows;

    this.funcionariosService.listar(page, size, this.busca).subscribe({
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

  /**
   * Busca funcionários quando o usuário digita
   */
  onBuscar(): void {
    const event: TableLazyLoadEvent = {
      first: 0,
      rows: this.rows,
    };
    this.carregarFuncionarios(event);
  }

  /**
   * Abre modal para criar novo funcionário
   */
  abrirModalNovo(): void {
    this.isEdit = false;
    this.funcionarioEditando = null;
    this.especialidadesSelecionadas = [];
    this.funcionarioForm.reset();
    this.funcionarioForm.patchValue({
      especialidadeIds: [],
      usuarioId: null,
    });
    this.displayModal = true;
  }

  /**
   * Abre modal para editar funcionário
   */
  abrirModalEditar(funcionario: Funcionario): void {
    this.isEdit = true;
    this.funcionarioEditando = funcionario;
    this.especialidadesSelecionadas = funcionario.especialidades || [];
    
    this.funcionarioForm.patchValue({
      nome: funcionario.nome,
      tipo: funcionario.tipo,
      crm: funcionario.crm || '',
      telefone: funcionario.telefone || '',
      usuarioId: funcionario.usuarioId || null,
      especialidadeIds: funcionario.especialidades?.map((e) => e.id) || [],
    });
    
    this.displayModal = true;
  }

  /**
   * Fecha o modal
   */
  fecharModal(): void {
    this.displayModal = false;
    this.funcionarioForm.reset();
    this.funcionarioEditando = null;
    this.especialidadesSelecionadas = [];
  }

  /**
   * Salva o funcionário (criar ou editar)
   */
  salvarFuncionario(): void {
    if (this.funcionarioForm.invalid) {
      this.funcionarioForm.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Preencha todos os campos obrigatórios.',
      });
      return;
    }

    this.loading = true;
    const formValue = this.funcionarioForm.value;
    const dados: any = {
      nome: formValue.nome,
      tipo: formValue.tipo,
    };

    // Adiciona campos opcionais apenas se preenchidos
    if (formValue.telefone && formValue.telefone.trim()) {
      dados.telefone = formValue.telefone.trim();
    }
    
    // CRM é obrigatório para médicos
    if (formValue.tipo === 'MEDICO') {
      if (!formValue.crm || !formValue.crm.trim()) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Atenção',
          detail: 'O CRM é obrigatório para médicos.',
        });
        this.loading = false;
        return;
      }
      dados.crm = formValue.crm.trim();
    } else if (formValue.crm && formValue.crm.trim()) {
      // Para não-médicos, pode ter CRM mas não é obrigatório
      dados.crm = formValue.crm.trim();
    }
    
    if (formValue.usuarioId) {
      dados.usuarioId = formValue.usuarioId;
    }

    // Adiciona especialidades se houver
    if (formValue.especialidadeIds && formValue.especialidadeIds.length > 0) {
      dados.especialidadeIds = formValue.especialidadeIds;
    }

    const acao = this.isEdit
      ? this.funcionariosService.update(this.funcionarioEditando!.id, dados)
      : this.funcionariosService.create(dados);

    acao.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `Funcionário ${this.isEdit ? 'atualizado' : 'criado'} com sucesso!`,
        });
        this.fecharModal();
        this.loading = false;
        // Recarrega a lista
        const event: TableLazyLoadEvent = {
          first: 0,
          rows: this.rows,
        };
        this.carregarFuncionarios(event);
      },
      error: (err) => {
        console.error('Erro ao salvar funcionário:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err.error?.message || err.message || 'Erro ao salvar funcionário. Verifique os dados e tente novamente.',
        });
        this.loading = false;
      },
    });
  }

  /**
   * Exclui um funcionário
   */
  excluirFuncionario(funcionario: Funcionario): void {
    const tipoTexto = funcionario.tipo === 'MEDICO' ? 'médico' : 'funcionário';
    
    const mensagem = `Você realmente deseja excluir o ${tipoTexto} "${funcionario.nome}"?

⚠️ ATENÇÃO: Esta ação é IRREVERSÍVEL!

Ao confirmar, serão PERMANENTEMENTE REMOVIDOS:
• O funcionário e todos os seus dados
• Todas as consultas vinculadas a este funcionário
• Todos os prontuários relacionados às consultas
• Receitas, atestados e anexos dos prontuários
• Vínculos com especialidades

Esta ação não pode ser desfeita. Tem certeza que deseja continuar?`;

    this.confirmationService.confirm({
      message: mensagem,
      header: 'Confirmar Exclusão Permanente',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, excluir permanentemente',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      acceptIcon: 'pi pi-trash',
      rejectIcon: 'pi pi-times',
      accept: () => {
        this.loading = true;
        this.funcionariosService.delete(funcionario.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Exclusão Concluída',
              detail: `O ${tipoTexto} "${funcionario.nome}" e todos os registros vinculados foram removidos permanentemente.`,
              life: 5000,
            });
            // Recarrega a lista mantendo a página atual
            const event: TableLazyLoadEvent = {
              first: 0,
              rows: this.rows,
            };
            this.carregarFuncionarios(event);
            this.loading = false;
          },
          error: (err) => {
            console.error('Erro ao excluir funcionário:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro na Exclusão',
              detail: err.error?.message || err.message || 'Não foi possível excluir o funcionário. Verifique se não há outros vínculos no sistema.',
              life: 5000,
            });
            this.loading = false;
          },
        });
      },
      reject: () => {
        // Usuário cancelou a exclusão
      },
    });
  }

  /**
   * Retorna a severidade da tag baseada no tipo
   */
  getSeverity(tipo: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' | null {
    switch (tipo) {
      case 'MEDICO':
        return 'success';
      case 'ATENDENTE':
        return 'info';
      default:
        return 'warn';
    }
  }

  /**
   * Formata especialidades para exibição
   */
  formatarEspecialidades(especialidades?: Especialidade[]): string {
    if (!especialidades || especialidades.length === 0) {
      return 'N/A';
    }
    return especialidades.map((e) => e.nome).join(', ');
  }

  /**
   * Gerencia mudanças nas especialidades selecionadas
   */
  onEspecialidadeChange(especialidadeId: number, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const currentIds = this.funcionarioForm.get('especialidadeIds')?.value || [];
    
    if (checked) {
      if (!currentIds.includes(especialidadeId)) {
        this.funcionarioForm.patchValue({
          especialidadeIds: [...currentIds, especialidadeId],
        });
      }
    } else {
      this.funcionarioForm.patchValue({
        especialidadeIds: currentIds.filter((id: number) => id !== especialidadeId),
      });
    }
  }
}
