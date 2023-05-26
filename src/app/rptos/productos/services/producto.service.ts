import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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

  get producto(){
    return {...this._producto};
  }

  constructor(private http: HttpClient) { 
    // console.log(localStorage.getItem('distid'))
  }

  getProducto(): Observable<Producto>{
    const url = `${this.baseUrl}/productos`;
    return this.http.get<Producto>(url)
  }

  getUsuariosML(): Observable<UsuariosMercadoLibre>{
    const url = `${this.baseUrl}/productos_ml/getUsuariosML`;
    return this.http.get<UsuariosMercadoLibre>(url);
  }

  getProductosML(id:number): Observable<ProductoMercadoLibre>{
    const url = `${this.baseUrl}/productos_ml/getproductos?userId=${id}`;
    return this.http.get<ProductoMercadoLibre>(url);
  }

  postExcelProduct(id:number, selectedFile?: File):Observable<any>{

    if(selectedFile != null){
      const formData = new FormData();
      formData.append('files', selectedFile, selectedFile.name);
      const url = `${this.baseUrl}/productos_ml/uploads?usuario_ml=${id}`;
      return this.http.post<any>(url, formData);
    }
    return of("El archivo esta vacio"); 
  }

}
