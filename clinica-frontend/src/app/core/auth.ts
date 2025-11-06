import { Injectable, inject, signal } from '@angular/core';
import { ApiService } from './api';
import { LoginResponse, PerfilKey, UsuarioSessao } from './models';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

const TOKEN_KEY = 'clinica_auth_token';
const USER_KEY = 'clinica_auth_user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);

  // Sinal (Signal) para guardar o usuário logado (moderno, 'zoneless')
  public usuarioLogado = signal<UsuarioSessao | null>(null);

  constructor() {
    // Ao iniciar o serviço, tente carregar a sessão do localStorage
    this.carregarSessao();
  }

  private carregarSessao(): void {
    const token = localStorage.getItem(TOKEN_KEY);
    const user = localStorage.getItem(USER_KEY);
    if (token && user) {
      this.usuarioLogado.set(JSON.parse(user) as UsuarioSessao);
    }
  }

  // Método de Login (Item 2.3)
  public login(email: string, senha: string): Observable<LoginResponse> {
    return this.api.post<LoginResponse>('auth/login', { email, senha }).pipe(
      tap((resposta) => {
        // 1. Salva no localStorage
        localStorage.setItem(TOKEN_KEY, resposta.token);
        localStorage.setItem(USER_KEY, JSON.stringify(resposta.user));
        // 2. Atualiza o Sinal (Signal)
        this.usuarioLogado.set(resposta.user);
      })
    );
  }

  // Método de Logout
  public logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.usuarioLogado.set(null);
    this.router.navigate(['/login']); // Redireciona para o login
  }

  // Pega o Token (para o Interceptor)
  public getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  // Verifica se está logado (para o Guard)
  public estaLogado(): boolean {
    return !!this.getToken(); // !! transforma em booleano
  }

  // Verifica permissão (para a Diretiva *appHas) (Item 2.3)
  public hasPermissao(chave: PerfilKey): boolean {
    const usuario = this.usuarioLogado();
    if (!usuario) {
      return false;
    }
    return usuario.permissoes.includes(chave);
  }
}
