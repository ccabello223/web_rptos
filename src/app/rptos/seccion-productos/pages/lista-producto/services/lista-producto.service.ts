import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { environment } from 'src/environments/environments';
import { NotaReponse, NotasVentasWebResponse, Producto, Productos, VentasWebResponse } from '../../../interfaces';
import { ProductoService } from '../../../services/producto.service';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { catchError, tap } from 'rxjs/operators';
import { UbicacionesResponse } from '../../../interfaces/ubicaciones-response';

@Injectable({
  providedIn: 'root'
})
export class ListaProductoService extends ProductoService {

  getProducto(): Observable<Productos>{
    const url = `${this.baseUrl}/productos`;
    return this.http.get<Productos>(url)
    // .pipe(
    //   tap (resp => {
    //     this.producto = resp.productos
    //   })
    // )
  }

  postExcelProduct(selectedFile?: File):Observable<any>{

    if(selectedFile != null){
      const formData = new FormData();
      formData.append('files', selectedFile, selectedFile.name);
      const url = `${this.baseUrl}/productos/actualizar_producto`;
      return this.http.post<any>(url, formData)
      .pipe(
        catchError( (error: Error) => of({ok: false, msg: error.message})),
      );;
    }
    return of("El archivo esta vacio"); 
  }

  getUbicaciones(productoid:number, distid:string):Observable<UbicacionesResponse>{
    const url = `${this.baseUrl}/ubicaciones/${productoid}/${distid}`;
    return this.http.get<UbicacionesResponse>(url)
  }

  postUbicaciones(body: any):Observable<any>{
    const url = `${this.baseUrl}/ubicaciones/postUbicacion`;
    return this.http.post<any>(url, body);
  }

  deleteUbicacion(id: number):Observable<any>{
    const url = `${this.baseUrl}/ubicaciones/deleteUbicacion/${id}`;
    return this.http.delete<any>(url);
  }

  postFotosProducto(body:any, idProducto: number): Observable<any>{
    const url = `${this.baseUrl}/foto_producto/postFotoProducto/${idProducto}`;
    return this.http.post<any>(url, body);
  }

  deleteProducts(body:any): Observable<any>{
    const url = `${this.baseUrl}/productos/deleteProducto`;
    return this.http.put<any>(url, body);
  }
}
