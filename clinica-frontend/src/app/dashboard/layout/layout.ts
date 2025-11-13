import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../components/header/header';
import { SidebarComponent } from '../components/sidebar/sidebar';
import { AuthService } from '../../core/auth';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class LayoutComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    // Verifica se o usuário está logado ao carregar o layout
    if (!this.authService.estaLogado() || !this.authService.usuarioLogado()) {
      this.router.navigate(['/login']);
    }
  }
}
