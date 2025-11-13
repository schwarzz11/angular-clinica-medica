import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/auth';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    AvatarModule,
    TooltipModule,
  ],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
})
export class HeaderComponent {
  private authService = inject(AuthService);

  public usuario = computed(() => this.authService.usuarioLogado());

  public logout(): void {
    this.authService.logout();
  }
}
