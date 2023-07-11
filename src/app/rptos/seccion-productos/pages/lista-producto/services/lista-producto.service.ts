import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { environment } from 'src/environments/environments';
import { Producto } from '../../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ListaProductoService {

  private baseUrl: string = environment.baseUrl;
  private _producto!: Producto[];
  private authService = inject(AuthService)


  public user = computed(() => this.authService.usuarioActual());

  get producto(){
    return {...this._producto};
  }

  get getBaseUrl(){
    return this.baseUrl;
  }


  constructor(private http: HttpClient) {

  }
}
