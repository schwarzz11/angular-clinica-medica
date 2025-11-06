import { Component, OnInit, inject, OnDestroy } from '@angular/core'; // Importar OnInit e OnDestroy
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router'; // Importar Router e ActivatedRoute
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs'; // Importar Subscription

// Imports dos Módulos PrimeNG
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';

// Imports de Serviço e Modelos
import { FuncionariosService } from '../services/funcionarios'; //
import { Funcionario, TipoFuncionario } from '../../../../core/models'; //

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule, // Essencial para o FormBuilder
    ButtonModule,
    CardModule,
    InputTextModule,
    ToastModule,
  ],
  templateUrl: './form.html', //
  styleUrls: ['./form.scss'],
  providers: [MessageService],
})
export class FormComponent implements OnInit, OnDestroy {
  // Injeção de Dependências
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute); // Para ler o ID da URL
  private readonly funcionariosService = inject(FuncionariosService);
  private readonly messageService = inject(MessageService);

  // Variáveis de Estado
  form!: FormGroup;
  loading = false;
  isEdit = false;
  private currentId: number | null = null;
  private validationSub?: Subscription; // Para limpar o listener de validação

  // CORREÇÃO: Adicionar 'OUTRO' para alinhar com o backend
  tiposFuncionario: { label: string; value: TipoFuncionario }[] = [
    { label: 'Médico', value: 'MEDICO' },
    { label: 'Atendente', value: 'ATENDENTE' },
    { label: 'Outro', value: 'OUTRO' },
  ];

  constructor() {
    // Inicializar o formulário
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.maxLength(100)]],
      tipo: ['', [Validators.required]],
      crm: [''], // Validador será dinâmico
      telefone: [''],
    });
  }

  ngOnInit(): void {
    // 1. Verificar se é modo de EDIÇÃO (Item E.4)
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.isEdit = true;
        this.currentId = +id;
        this.carregarFuncionario(this.currentId);
      }
    });

    // 2. Adicionar Validação Dinâmica (Item E.5 / 6.6)
    this.configurarValidacaoCRM();
  }

  ngOnDestroy(): void {
    // Limpar a subscrição para evitar vazamento de memória
    this.validationSub?.unsubscribe();
  }

  /**
   * Carrega os dados do funcionário (se for edição)
   */
  private carregarFuncionario(id: number): void {
    this.loading = true;
    this.funcionariosService.getById(id).subscribe({
      next: (funcionario) => {
        this.form.patchValue(funcionario); // Preenche o formulário
        this.loading = false;
      },
      error: () => this.tratarErro('Erro ao carregar dados do funcionário.'),
    });
  }

  /**
   * Lógica de Validação (Item 6.6)
   * Ouve mudanças no campo 'tipo'.
   */
  private configurarValidacaoCRM(): void {
    const crmControl = this.form.get('crm');
    if (!crmControl) return;

    // Ouve as mudanças do campo 'tipo'
    this.validationSub = this.form.get('tipo')?.valueChanges.subscribe((tipo) => {
      if (tipo === 'MEDICO') {
        // Se for médico, CRM é obrigatório
        crmControl.setValidators([Validators.required, Validators.maxLength(20)]);
      } else {
        // Se não, limpa validadores
        crmControl.clearValidators();
      }
      crmControl.updateValueAndValidity(); // Atualiza o estado do controle
    });
  }

  /**
   * Chamado pelo botão Salvar
   */
  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // Marcar campos inválidos
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Preencha os campos obrigatórios.',
      });
      return;
    }
    this.loading = true;
    const funcionarioData: Partial<Funcionario> = this.form.value;

    // Define qual ação (Criar ou Atualizar)
    const acao = this.isEdit
      ? this.funcionariosService.update(this.currentId!, funcionarioData)
      : this.funcionariosService.create(funcionarioData);

    acao.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `Funcionário ${this.isEdit ? 'atualizado' : 'criado'} com sucesso!`,
        });
        // Atraso para o usuário ver o toast
        setTimeout(() => this.router.navigate(['/dashboard/funcionarios']), 1500);
      },
      error: (err) => this.tratarErro(err.error?.message || 'Erro ao salvar funcionário.'),
    });
  }

  /**
   * Helper para exibir erros
   */
  private tratarErro(mensagem: string): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Erro',
      detail: mensagem,
    });
    this.loading = false;
  }
}
