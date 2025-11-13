import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
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
    RouterLink,
    // --- MÓDULOS ---
    ButtonModule,
    CardModule,
    InputTextModule,
    ToastModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  providers: [MessageService],
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);

  email = '';
  senha = '';
  loading = false;

  fazerLogin(): void {
    if (!this.email || !this.senha) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Preencha todos os campos.',
      });
      return;
    }

    this.loading = true;
    this.authService.login(this.email, this.senha).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Login realizado com sucesso!',
        });
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 500);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err.error?.message || 'E-mail ou senha inválidos.',
        });
        this.loading = false;
      },
    });
  }
}
