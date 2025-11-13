import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verifica se há token válido
  const token = authService.getToken();
  const usuario = authService.usuarioLogado();

  if (token && usuario) {
    return true; // Usuário logado, pode acessar a rota
  }

  // Usuário não logado, redireciona para /login
  router.navigate(['/login'], { 
    queryParams: { returnUrl: state.url } 
  });
  return false;
};
