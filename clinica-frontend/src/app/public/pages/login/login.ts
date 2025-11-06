import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth';
import { MessageService } from 'primeng/api';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// --- IMPORTS CORRETOS (NgModules) ---
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    // --- MÓDULOS ---
    ButtonModule,
    CardModule,
    InputTextModule,
    ToastModule,
  ],
  templateUrl: './login.html', //
  styleUrl: './login.scss',
  providers: [MessageService],
})
export class LoginComponent {
  private readonly authService = inject(AuthService); //
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);

  // --- CORREÇÃO: Inicializar campos como vazios ---
  email = '';
  senha = '';
  loading = false;

  fazerLogin(): void {
    this.loading = true;
    this.authService.login(this.email, this.senha).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'E-mail ou senha inválidos.',
        });
        this.loading = false;
      },
    });
  }
}
