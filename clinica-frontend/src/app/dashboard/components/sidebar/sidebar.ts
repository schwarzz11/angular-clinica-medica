import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';

// --- IMPORT DE MÓDULO (O CORRETO) ---
import { PanelMenuModule } from 'primeng/panelmenu';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    PanelMenuModule, // MÓDULO
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class SidebarComponent {
  // (O seu array 'items' continua igual)
  items: MenuItem[] = [
    { label: 'Pacientes', icon: 'pi pi-fw pi-users' },
    { label: 'Agenda', icon: 'pi pi-fw pi-calendar' },
    {
      label: 'Administração',
      icon: 'pi pi-fw pi-cog',
      items: [
        { label: 'Funcionários', icon: 'pi pi-fw pi-id-card' },
        { label: 'Especialidades', icon: 'pi pi-fw pi-briefcase' },
        { label: 'Convênios', icon: 'pi pi-fw pi-shield' },
      ],
    },
  ];
}
