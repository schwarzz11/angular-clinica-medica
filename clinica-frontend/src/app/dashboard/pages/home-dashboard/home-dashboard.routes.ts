import { Routes } from '@angular/router';
import { authGuard } from '../../../core/auth-guard';
import { HomeDashboardComponent } from './home-dashboard';

export const HOME_DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: HomeDashboardComponent,
    canActivate: [authGuard],
  },
];
