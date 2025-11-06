import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

// Importa os providers de animação (necessários para o PrimeNG)
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// --- A SOLUÇÃO ESTÁ AQUI (Item 1 e 2) ---
// 1. Importa os providers do PrimeNG v20+
import { providePrimeNG } from 'primeng/config';
import Lara from '@primeuix/themes/lara'; // O tema que você instalou

export const appConfig: ApplicationConfig = {
  providers: [
    // Rotas (do seu app.routes.ts)
    provideRouter(routes),

    // HttpClient (para o seu core/api.service.ts)
    provideHttpClient(
      withInterceptors([]) // Deixamos pronto para o Interceptor
    ),

    // --- 2. REGISTRA OS PROVIDERS DO PRIMENG ---
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Lara, // Carrega o tema Lara (CSS de Cores + Estrutura)
      },
      ripple: true,
    }),

    // Providers necessários (para 'zone.js')
    importProvidersFrom(BrowserModule, BrowserAnimationsModule),
  ],
};
