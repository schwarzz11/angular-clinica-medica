import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'; // HttpParams ainda é útil
import { Observable } from 'rxjs';
import { Funcionario } from '../../../../core/models';

// --- CORREÇÃO: Importar o ApiService ---
import { ApiService } from '../../../../core/api'; //

// Interface para a resposta paginada (baseado no seu list.ts)
export interface RespostaPaginada {
  items: Funcionario[];
  total: number;
  page: number;
  size: number;
}

@Injectable({
  providedIn: 'root',
})
export class FuncionariosService {
  // --- CORREÇÃO: Injetar ApiService em vez de HttpClient ---
  private readonly apiService = inject(ApiService);

  constructor() {}

  listar(page = 1, size = 10, busca = ''): Observable<RespostaPaginada> {
    // HttpParams ainda é a melhor forma de construir query strings
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('busca', busca);

    // --- CORREÇÃO: Usar apiService.get() e passar a rota relativa ---
    // O ApiService vai adicionar 'http://localhost:3000/api/v1/'
    // O método 'get' do ApiService precisa ser ajustado para aceitar HttpParams

    // ATENÇÃO: Precisamos modificar o ApiService para aceitar 'params'
    // Vamos fazer isso no PRÓXIMO PASSO se este falhar.
    // Por enquanto, vamos tentar concatenar a string manualmente.

    const path = `funcionarios?page=${page}&size=${size}&busca=${busca}`;
    return this.apiService.get<RespostaPaginada>(path);
  }

  getById(id: number): Observable<Funcionario> {
    // --- CORREÇÃO: ---
    return this.apiService.get<Funcionario>(`funcionarios/${id}`);
  }

  create(data: Partial<Funcionario>): Observable<Funcionario> {
    // --- CORREÇÃO: ---
    return this.apiService.post<Funcionario>('funcionarios', data);
  }

  update(id: number, data: Partial<Funcionario>): Observable<Funcionario> {
    // --- CORREÇÃO: ---
    return this.apiService.put<Funcionario>(`funcionarios/${id}`, data);
  }

  delete(id: number): Observable<void> {
    // --- CORREÇÃO: ---
    return this.apiService.delete<void>(`funcionarios/${id}`);
  }
}
