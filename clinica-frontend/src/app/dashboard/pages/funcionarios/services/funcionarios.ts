import { inject, Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Funcionario } from '../../../../core/models';
import { ApiService } from '../../../../core/api';

// Interface para a resposta paginada
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
  private readonly apiService = inject(ApiService);

  listar(page = 1, size = 10, busca = ''): Observable<RespostaPaginada> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('busca', busca);

    return this.apiService.get<RespostaPaginada>('funcionarios', params);
  }

  getById(id: number): Observable<Funcionario> {
    return this.apiService.get<Funcionario>(`funcionarios/${id}`);
  }

  create(data: Partial<Funcionario>): Observable<Funcionario> {
    return this.apiService.post<Funcionario>('funcionarios', data);
  }

  update(id: number, data: Partial<Funcionario>): Observable<Funcionario> {
    return this.apiService.put<Funcionario>(`funcionarios/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.apiService.delete<void>(`funcionarios/${id}`);
  }
}
