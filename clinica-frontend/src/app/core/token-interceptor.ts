import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth';

// Formato de Interceptor 'standalone' (funcional)
export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Se não for para a nossa API (ex: API de CEP) ou não tiver token, ignora
  if (!token || !req.url.includes('http://localhost:3000')) {
    return next(req);
  }

  // Clona a requisição e adiciona o cabeçalho
  const reqComToken = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(reqComToken);
};
