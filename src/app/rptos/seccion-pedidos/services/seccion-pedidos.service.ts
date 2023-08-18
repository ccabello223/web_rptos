import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class SeccionPedidosService {

  private baseUrl: string = environment.baseUrl;
  protected http = inject(HttpClient);

  constructor() { }

  postPedidoAlmacen(body:any): Observable<any>{
    const url = `${this.baseUrl}/pedido_almacen/postPedidoAlmacen`;
    return this.http.post<any>(url, body);
  }
}