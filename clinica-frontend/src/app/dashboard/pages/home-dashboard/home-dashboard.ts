import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-dashboard.html',
})
export class HomeDashboardComponent {
  // Aqui ficará a lógica dos seus KPIs, atalhos, etc.
}
