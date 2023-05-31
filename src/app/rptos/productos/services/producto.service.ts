import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environments';
import { Producto, ProductoElement, ProductoMercadoLibre, UsuariosMercadoLibre } from '../interface/interface';
import { Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private baseUrl: string = environment.baseUrl;
  private _producto!: ProductoElement[];
  private _rolId: number = Number(localStorage.getItem('rol'));
  private _usuario: number = Number(localStorage.getItem('usuario'));
  private _distid?: string = localStorage.getItem('distid')?.toString();

  get producto(){
    return {...this._producto};
  }

  get rol(){
    return this._rolId;
  }

  get tipoUsuario(){
    return this._usuario;
  }

  get tipoTienda(){
    return this._distid;
  }

  constructor(private http: HttpClient) { 

  }

  getProducto(): Observable<Producto>{
    const url = `${this.baseUrl}/productos`;
    return this.http.get<Producto>(url)
  }

  getUsuariosML(usuario:number = 0): Observable<UsuariosMercadoLibre>{
    if(usuario == 0){
      const url = `${this.baseUrl}/productos_ml/getUsuariosML`;
      return this.http.get<UsuariosMercadoLibre>(url);
    }else{
      const url = `${this.baseUrl}/productos_ml/getUsuariosML?usuario=${usuario}`;
      console.log(usuario);
      return this.http.get<UsuariosMercadoLibre>(url);
    }
  }

  getProductosML(id:number): Observable<ProductoMercadoLibre>{
    const url = `${this.baseUrl}/productos_ml/getproductos?userId=${id}`;
    return this.http.get<ProductoMercadoLibre>(url);
  }

  getProductosmlTemp(id:number): Observable<ProductoMercadoLibre>{
    const url = `${this.baseUrl}/productos_ml/getProductosmlTemp?userId=${id}`;
    return this.http.get<ProductoMercadoLibre>(url);
  }

  getProductoML(id:number): Observable<any>{
    const url = `${this.baseUrl}/productos_ml/getProductoML?id=${id}`;
    return this.http.get<any>(url)
  }

  postExcelProduct(id:number, selectedFile?: File, rol:number = 0):Observable<any>{

    if(selectedFile != null){
      const formData = new FormData();
      formData.append('files', selectedFile, selectedFile.name);

      if( rol == 1 || rol == 6){
        const url = `${this.baseUrl}/productos_ml/postActualizarPrecio?usuario_ml=${id}`;
        return this.http.post<any>(url, formData);
      }else{
        const url = `${this.baseUrl}/productos_ml/uploads?usuario_ml=${id}`;
        return this.http.post<any>(url, formData);
      }
    }
    return of("El archivo esta vacio"); 
  }

  deleteProduct(id:number): Observable<any>{
    const url = `${this.baseUrl}/productos_ml/deleteProducto?id=${id}`;
    return this.http.delete<any>(url);
  }

}
