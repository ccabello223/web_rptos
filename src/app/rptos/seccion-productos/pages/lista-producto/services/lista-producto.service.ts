import { Injectable } from '@angular/core';
import { Productos,  } from '../../../interfaces';
import { ProductoService } from '../../../services/producto.service';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { catchError } from 'rxjs/operators';
import { UbicacionesResponse } from '../../../interfaces/ubicaciones-response';
import { ProductoHistorialPrecio } from '../../../interfaces/models/producto_historial_precio';

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

  deleteBorrarFoto(id:number): Observable<any>{
    const url = `${this.baseUrl}/foto_producto/deleteFoto/${id}`;
    return this.http.delete<any>(url)
    .pipe(
      catchError( (error: Error) => of({ok: false, msg: error.message})),
    );
  }

  deleteProducts(body:any): Observable<any>{
    const url = `${this.baseUrl}/productos/deleteProducto`;
    return this.http.put<any>(url, body);
  }

  getProductosHistorialPrecio(idProducto:number):Observable<ProductoHistorialPrecio[]>{
    const url = `${this.baseUrl}/producto_historial_precio?id_producto=${idProducto}`;
    return this.http.get<ProductoHistorialPrecio[]>(url)
  }
}
