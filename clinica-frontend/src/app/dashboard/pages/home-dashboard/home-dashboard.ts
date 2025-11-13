import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth';

@Component({
  selector: 'app-home-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home-dashboard.html',
  styleUrl: './home-dashboard.scss',
})
export class HomeDashboardComponent {
  private authService = inject(AuthService);
  public usuario = computed(() => this.authService.usuarioLogado());
}
