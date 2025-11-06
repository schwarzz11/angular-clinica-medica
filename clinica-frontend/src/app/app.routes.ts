import { Routes } from '@angular/router';
import { LayoutComponent } from './dashboard/layout/layout';
import { authGuard } from './core/auth-guard';
import { LoginComponent } from './public/pages/login/login';
import { HomeComponent } from './public/pages/home/home';

export const routes: Routes = [
  // --- Rotas do Dashboard (Protegidas) ---
  {
    path: 'dashboard',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      // --- 1. ADICIONE ESTA ROTA FILHA ---
      {
        path: 'funcionarios',
        // Lazy-loading: Só carrega estas rotas quando
        // o usuário acessar /dashboard/funcionarios
        loadChildren: () =>
          import('./dashboard/pages/funcionarios/funcionarios.routes').then(
            (r) => r.FUNCIONARIOS_ROUTES
          ),
      },
      // (As outras rotas filhas - pacientes, etc. - virão aqui)
    ],
  },

  // --- Rotas Públicas (Abertas) ---
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },

  // --- Redirecionamento Padrão ---
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' },
];
