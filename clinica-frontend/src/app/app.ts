import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // 1. Importe

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, // 2. Adicione aqui
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class AppComponent {}
