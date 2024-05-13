import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class InicioService {

  protected baseUrl: string = environment.baseUrl;
  protected http = inject(HttpClient);

  constructor() { }

  postEmpleado(body: any): Observable<any> {
    const url = `${this.baseUrl}/empleado/postNewEmpleado`;
    return this.http.post<any>(url, body);
  }
}
