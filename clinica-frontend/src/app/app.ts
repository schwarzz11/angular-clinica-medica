// [SUBSTITUA O CONTEÚDO ATUAL POR ISTO]

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root', // O seletor que está no index.html
  standalone: true,
  imports: [
    RouterOutlet // Importa o RouterOutlet para aplicações standalone
  ],
  templateUrl: './app.html', // Aponta para o template HTML
})
export class AppComponent {
  title = 'clinica-frontend';
}