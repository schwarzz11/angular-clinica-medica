import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../../core/api';
import { Especialidade } from '../../../../core/models';

@Injectable({
  providedIn: 'root',
})
export class EspecialidadesService {
  private readonly apiService = inject(ApiService);

  listar(): Observable<Especialidade[]> {
    return this.apiService.get<Especialidade[]>('especialidades');
  }
}

