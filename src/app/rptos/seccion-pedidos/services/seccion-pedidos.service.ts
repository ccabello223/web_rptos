import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environments';
import { PedidoAlmacen } from '../interfaces/models/pedido_almacen';
import { FotoPedidoAlmacen } from '../interfaces/models/foto_pedido_almacen';
import { Hablador, HabladorInfo } from '../interfaces/models/hablador_pedido_info';
import { DireccionHabladorResponse } from '../interfaces/response/direccion_hablador_response';

@Injectable({
  providedIn: 'root'
})

export class SeccionPedidosService {

  private baseUrl: string = environment.baseUrl;
  protected http = inject(HttpClient);

  constructor() { }

  getPedidoAlmacen(): Observable<PedidoAlmacen[]>{
    const url = `${this.baseUrl}/pedido_almacen`;
    return this.http.get<PedidoAlmacen[]>(url);
  }

  getHabladorInfo(): Observable<HabladorInfo>{
    const url = `${this.baseUrl}/hablador_pedido_info`;
    return this.http.get<HabladorInfo>(url);
  }

  getDireccionHablador(cliente:string): Observable<DireccionHabladorResponse>{
    const url = `${this.baseUrl}/direccion_hablador_pedido?cliente=${cliente}`;
    return this.http.get<DireccionHabladorResponse>(url);
  }

  postHabladorInfo(body:any):Observable<any>{
    const url = `${this.baseUrl}/hablador_pedido_info/postHabladorInfo`;
    return this.http.post<any>(url, body)
    .pipe(
      // catchError( (error: Error) => of({ok: false, msg: error.message})),
      catchError(err => of({ok:false, msg: err.error.msg}))
    );
  }

  postDireccionHablador(body:any):Observable<any>{
    const url = `${this.baseUrl}/direccion_hablador_pedido/postDireccionHablador`;
    return this.http.post<any>(url, body)
    .pipe(
      catchError(err => of({ok:false, msg: err.error.msg}))
    );
  }

  postPedidoAlmacen(body:any): Observable<any>{
    const url = `${this.baseUrl}/pedido_almacen/postPedidoAlmacen`;
    return this.http.post<any>(url, body)
    .pipe(
      catchError( (error: Error) => of({ok: false, msg: error.message})),
    );
  }

  getFotosPedidoAlmacen(id:number): Observable<FotoPedidoAlmacen[]>{
    const url = `${this.baseUrl}/foto_pedido_almacen/${id}`;
    return this.http.get<FotoPedidoAlmacen[]>(url)
    .pipe(
      catchError( () => of([])),
    );
  }

  postFotosPedidosAlmacen(body:any, idPedido: number): Observable<any>{
    const url = `${this.baseUrl}/foto_pedido_almacen/postImagenPedido/${idPedido}`;
    return this.http.post<any>(url, body)
    .pipe(
      catchError( (error: Error) => of({ok: false, msg: error.message})),
    );
  }

  borrarFotoPedido(id:number): Observable<any>{
    const url = `${this.baseUrl}/foto_pedido_almacen/deleteFoto/${id}`;
    return this.http.delete<any>(url)
    .pipe(
      catchError( (error: Error) => of({ok: false, msg: error.message})),
    );
  }
}