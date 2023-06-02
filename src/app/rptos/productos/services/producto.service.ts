import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject } from '@angular/core';
import { environment } from 'src/environments/environments';
import { Producto, ProductoElement, ProductoMercadoLibre, UsuariosMercadoLibre } from '../interface/interface';
import { Observable, of, tap } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private baseUrl: string = environment.baseUrl;
  private _producto!: ProductoElement[];
  private authService = inject(AuthService)


  public user = computed(() => this.authService.usuarioActual());

  get producto(){
    return {...this._producto};
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

  getProductoML(id_producto:number, usuario_ml:number): Observable<any>{
    const url = `${this.baseUrl}/productos_ml/getProductoML?id_producto=${id_producto}&usuario_ml=${usuario_ml}`;
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
