import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../../../core/api';
import { Funcionario } from '../../../../core/models';

// Interface para a resposta paginada (do Backend)
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
  private readonly api = inject(ApiService);

  listar(page = 1, size = 10, busca = '') {
    // ... (seu método listar() ... )
    const params = new URLSearchParams();
    params.set('page', page.toString());
    params.set('size', size.toString());
    if (busca) params.set('busca', busca);
    return this.api.get<RespostaPaginada>(`funcionarios?${params.toString()}`);
  }

  // --- 1. ADICIONE ESTE MÉTODO ---
  getById(id: number) {
    return this.api.get<Funcionario>(`funcionarios/${id}`);
  }

  // --- 2. ADICIONE ESTE MÉTODO ---
  create(funcionario: Partial<Funcionario>) {
    return this.api.post<Funcionario>('funcionarios', funcionario);
  }

  // --- 3. ADICIONE ESTE MÉTODO ---
  update(id: number, funcionario: Partial<Funcionario>) {
    return this.api.put<Funcionario>(`funcionarios/${id}`, funcionario);
  }

  // --- 4. ADICIONE ESTE MÉTODO ---
  delete(id: number) {
    return this.api.delete<Funcionario>(`funcionarios/${id}`);
  }
}
