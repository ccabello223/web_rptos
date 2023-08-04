import { Injectable } from '@angular/core';
import { ProductoService } from '../../../services/producto.service';
import { Observable } from 'rxjs';
import { ItemsVentasWebResponse, VentasWebResponse } from '../../../interfaces';
import { FormasDePago } from '../../../interfaces/models/formas_de_pago';
import { TiendasEnWeb } from '../../../interfaces/models/tiendas_web';

@Injectable({
  providedIn: 'root'
})
export class ListaProductoWebService extends ProductoService {

  constructor() {
    super();
  }

  getVentas(usuario:number = 0): Observable<VentasWebResponse>{
    if(usuario == 0){
      const url = `${this.baseUrl}/ventas_web`;
      return this.http.get<VentasWebResponse>(url)
    }else{
      const url = `${this.baseUrl}/ventas_web?usuario=${usuario}`;
      return this.http.get<VentasWebResponse>(url)
    }
  }

  postVentas(body:any): Observable<any>{
    const url = `${this.baseUrl}/ventas_web/postVentas`;
    return this.http.post<any>(url, body);
  }

  deleteVenta(id:number): Observable<any>{
    const url = `${this.baseUrl}/ventas_web/deleteVenta?id=${id}`;
    return this.http.delete<any>(url);
  }

  getItemsVentasWeb(ventas_web_id:number):Observable<ItemsVentasWebResponse>{
    const url = `${this.baseUrl}/items_ventas_web/byId?ventas_web_id=${ventas_web_id}`;
    return this.http.get<ItemsVentasWebResponse>(url);
  }

  getFormaDePagos():Observable<FormasDePago[]>{
    const url = `${this.baseUrl}/formas_de_pago`;
    return this.http.get<FormasDePago[]>(url);
  }

  getRedesSociales():Observable<TiendasEnWeb[]>{
    const url = `${this.baseUrl}/tiendas_web`;
    return this.http.get<TiendasEnWeb[]>(url);
  }

  postFotosComprobante(body:any, idVenta: number): string{
    const url = `${this.baseUrl}/ventas_web/postImagenVenta/${idVenta}`;
    this.http.post<any>(url, body)
    .subscribe( resp => {
      return resp["message"];
    });

    return 'No se ha podido subir nada';
  }
}
