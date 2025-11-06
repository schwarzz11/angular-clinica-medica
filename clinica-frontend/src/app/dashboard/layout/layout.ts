import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // 1. Importe
import { HeaderComponent } from '../components/header/header'; // 2. Importe
import { SidebarComponent } from '../components/sidebar/sidebar'; // 3. Importe

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet, // 4. Adicione
    HeaderComponent, // 5. Adicione
    SidebarComponent, // 6. Adicione
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class LayoutComponent {}
