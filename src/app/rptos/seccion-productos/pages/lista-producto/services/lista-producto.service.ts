import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { environment } from 'src/environments/environments';
import { NotaReponse, NotasVentasWebResponse, Producto, Productos, VentasWebResponse } from '../../../interfaces';
import { ProductoService } from '../../../services/producto.service';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { UsuariosWebs } from '../../../interfaces/usuario-webs-response';
import { ProductosMercadolibreResponse } from '../../../interfaces/producto-webs-response';

@Injectable({
  providedIn: 'root'
})
export class ListaProductoService extends ProductoService {

  getProducto(): Observable<Productos>{
    const url = `${this.baseUrl}/productos`;
    return this.http.get<Productos>(url)
  }

  postExcelProduct(selectedFile?: File):Observable<any>{

    if(selectedFile != null){
      const formData = new FormData();
      formData.append('files', selectedFile, selectedFile.name);
      const url = `${this.baseUrl}/productos/actualizar_producto`;
      return this.http.post<any>(url, formData);
    }
    return of("El archivo esta vacio"); 
  }
}
