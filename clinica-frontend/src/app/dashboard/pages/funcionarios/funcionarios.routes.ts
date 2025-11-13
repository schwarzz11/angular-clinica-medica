import { Routes } from '@angular/router';
import { authGuard } from '../../../core/auth-guard';
import { ListComponent } from './list/list';
import { FormComponent } from './form/form';

// Estas são as rotas filhas do /dashboard - TODAS PROTEGIDAS
export const FUNCIONARIOS_ROUTES: Routes = [
  {
    path: '', // Rota /dashboard/funcionarios
    component: ListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'novo', // Rota /dashboard/funcionarios/novo
    component: FormComponent,
    canActivate: [authGuard],
  },
  {
    path: 'editar/:id', // Rota /dashboard/funcionarios/editar/123
    component: FormComponent,
    canActivate: [authGuard],
  },
];
