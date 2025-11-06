import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importar CommonModule
import { Router, RouterLink } from '@angular/router'; // Importar RouterLink
import { AuthService } from '../../../core/auth'; // Importar AuthService
import { ButtonModule } from 'primeng/button'; // Importar ButtonModule
import { ToolbarModule } from 'primeng/toolbar'; // Importar ToolbarModule
import { AvatarModule } from 'primeng/avatar'; // Importar AvatarModule
import { TooltipModule } from 'primeng/tooltip'; // Importar TooltipModule

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ToolbarModule,
    ButtonModule,
    AvatarModule,
    TooltipModule, // Adicionar TooltipModule
  ],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'], //
})
export class HeaderComponent {
  // Injetar o AuthService
  private authService = inject(AuthService);

  // Criar um "Signal" computado que reage a mudanças no usuário logado
  // O 'usuarioLogado' vem do AuthService
  public usuario = computed(() => this.authService.usuarioLogado());

  // Método de Logout
  public logout(): void {
    this.authService.logout();
  }
}
