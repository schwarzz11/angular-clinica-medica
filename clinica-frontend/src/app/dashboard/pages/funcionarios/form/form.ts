import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    ToastModule
  ],
  templateUrl: './form.html',
  styleUrls: ['./form.scss'],
  providers: [MessageService],
})
export class FormComponent {
  form!: FormGroup;
  loading = false;
  isEdit = false;

  tiposFuncionario = [
    { label: 'Médico', value: 'MEDICO' },
    { label: 'Atendente', value: 'ATENDENTE' },
  ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      tipo: ['', Validators.required],
      crm: [''],
      telefone: [''],
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    console.log(this.form.value);
    this.loading = false;
  }
}
