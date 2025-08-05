import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tarea } from '../models/tarea.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TareasService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  getTareas(): Observable<Tarea[]> {
    return this.http.get<Tarea[]>(this.apiUrl);
  }

  getTarea(id: number): Observable<Tarea> {
    return this.http.get<Tarea>(`${this.apiUrl}/${id}`);
  }

  crearTarea(tarea: Tarea): Observable<Tarea> {
    return this.http.post<Tarea>(this.apiUrl, tarea);
  }

  actualizarTarea(id: number, tarea: Tarea): Observable<Tarea> {
    return this.http.patch<Tarea>(`${this.apiUrl}/${id}`, tarea);
  }

  eliminarTarea(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  cambiarEstadoTarea(id: number, completada: boolean): Observable<Tarea> {
    return this.http.patch<Tarea>(`${this.apiUrl}/${id}`, { completada });
  }
}
