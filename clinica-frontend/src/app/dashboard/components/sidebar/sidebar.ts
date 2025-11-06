import { Component, OnInit, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
// import { PanelMenuModule } from 'primeng/panelmenu'; // <-- REMOVIDO
import { AuthService } from '../../../core/auth';
import { PerfilKey } from '../../../core/models';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router'; // <-- Adicionar RouterLinkActive
import { TooltipModule } from 'primeng/tooltip'; // <-- Adicionar TooltipModule

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule, // Necessário para *ngFor
    RouterLink, // Necessário para [routerLink]
    RouterLinkActive, // Necessário para routerLinkActive="active-link"
    TooltipModule, // Para o (pTooltip)
    // PanelMenuModule // <-- REMOVIDO
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class SidebarComponent implements OnInit {
  items: MenuItem[] = [];
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.items = this.buildMenu();
  }

  private can(key: PerfilKey): boolean {
    return this.authService.hasPermissao(key);
  }

  private buildMenu(): MenuItem[] {
    const menu: MenuItem[] = [
      // --- CORREÇÃO: Novo link Padrão ---
      {
        label: 'Dashboard',
        icon: 'pi pi-fw pi-home',
        routerLink: ['/dashboard'], // Aponta para a nova Home
        visible: true, // Visível para todos que logam
      },
      // --- Menu Principal ---
      {
        label: 'Agenda',
        icon: 'pi pi-fw pi-calendar',
        routerLink: ['/dashboard/agenda'],
        visible: this.can('consulta:ler'),
      },
      {
        label: 'Pacientes',
        icon: 'pi pi-fw pi-users',
        routerLink: ['/dashboard/pacientes'],
        visible: this.can('paciente:ler'),
      },
      {
        label: 'Prontuários',
        icon: 'pi pi-fw pi-file-medical', // <-- CORREÇÃO: Ícone adicionado
        routerLink: ['/dashboard/prontuarios'],
        visible: this.can('prontuario:ler'),
      },

      // --- Gestão (Desagrupado) ---
      {
        label: 'Funcionários',
        icon: 'pi pi-fw pi-id-card',
        routerLink: ['/dashboard/funcionarios'],
        visible: this.can('funcionario:ler'),
      },
      {
        label: 'Especialidades',
        icon: 'pi pi-fw pi-briefcase',
        routerLink: ['/dashboard/especialidades'],
        visible: this.can('especialidade:ler'),
      },
      {
        label: 'Convênios',
        icon: 'pi pi-fw pi-shield',
        routerLink: ['/dashboard/convenios'],
        visible: this.can('convenio:ler'),
      },
      {
        label: 'Perfis e Permissões',
        icon: 'pi pi-fw pi-key',
        routerLink: ['/dashboard/perfis'],
        visible: this.can('perfil:ler'),
      },

      // --- Sistema (Desagrupado) ---
      {
        label: 'Relatórios',
        icon: 'pi pi-fw pi-chart-bar',
        routerLink: ['/dashboard/relatorios'],
        visible: this.can('relatorio:ler'),
      },
      {
        label: 'Configurações',
        icon: 'pi pi-fw pi-sliders-h',
        routerLink: ['/dashboard/configuracoes'],
        visible: this.can('configuracao:ler'),
      },
    ];

    return menu.filter((item) => item.visible !== false);
  }
}
