import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth'; // Verifique se o nome do seu arquivo é 'auth-service.ts'

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.estaLogado()) {
    return true; // Usuário logado, pode acessar a rota
  }

  // Usuário não logado, redireciona para /login
  console.log('AuthGuard: Usuário não logado, redirecionando para /login'); // Adicione este log
  router.navigate(['/login']);
  return false;
};
