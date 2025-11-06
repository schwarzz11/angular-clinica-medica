import { Component } from '@angular/core';

// --- IMPORTS CORRETOS (NgModules) ---
import { ToolbarModule } from 'primeng/toolbar';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    ToolbarModule, // MÓDULO
    AvatarModule,
    ButtonModule,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class HeaderComponent {}
