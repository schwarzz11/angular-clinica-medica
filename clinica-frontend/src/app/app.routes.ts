import { Routes } from '@angular/router';
import { LayoutComponent } from './dashboard/layout/layout';
import { authGuard } from './core/auth-guard';
import { HomeComponent } from './public/pages/home/home';
import { LoginComponent } from './public/pages/login/login';

export const routes: Routes = [
  // --- Rotas do Dashboard (Protegidas) ---
  {
    path: 'dashboard',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      // --- CORREÇÃO: Nova rota padrão do Dashboard ---
      {
        path: '', // Rota /dashboard (padrão)
        loadChildren: () =>
          import('./dashboard/pages/home-dashboard/home-dashboard.routes').then(
            (r) => r.HOME_DASHBOARD_ROUTES
          ),
      },
      // --- Rota da Trilha 1 (Funcional) ---
      {
        path: 'funcionarios',
        loadChildren: () =>
          import('./dashboard/pages/funcionarios/funcionarios.routes').then(
            (r) => r.FUNCIONARIOS_ROUTES
          ),
      },
      // --- Esqueleto da Trilha 2 (Comentado) ---
      // (Adicione as outras rotas aqui conforme as cria)
    ],
  },

  // --- Rotas Públicas ---
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },

  // --- Redirecionamento Principal ---
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' },
];
