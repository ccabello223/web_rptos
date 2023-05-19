import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environments.prod';
import { Producto, ProductoElement } from '../interface/interface';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private baseUrl: string = environment.baseUrl;
  private _producto!: ProductoElement[];

  get producto(){
    return {...this._producto};
  }

  constructor(private http: HttpClient) { }

  getProducto(): Observable<Producto>{
    const url = `${this.baseUrl}/productos`;
    return this.http.get<Producto>(url)
  }

}
