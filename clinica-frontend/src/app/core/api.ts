import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api/v1'; // URL Base do Backend

  // Método GET
  public get<T>(path: string) {
    return this.http.get<T>(`${this.apiUrl}/${path}`);
  }

  // Método POST
  public post<T>(path: string, body: unknown) {
    return this.http.post<T>(`${this.apiUrl}/${path}`, body);
  }

  // Método PUT
  public put<T>(path: string, body: unknown) {
    return this.http.put<T>(`${this.apiUrl}/${path}`, body);
  }

  // Método DELETE
  public delete<T>(path: string) {
    return this.http.delete<T>(`${this.apiUrl}/${path}`);
  }
}
