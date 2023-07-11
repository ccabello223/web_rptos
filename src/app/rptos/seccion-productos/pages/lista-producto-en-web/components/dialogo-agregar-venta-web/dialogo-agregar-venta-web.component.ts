import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductoService } from 'src/app/rptos/productos/services/producto.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dialogo-agregar-venta-web',
  templateUrl: './dialogo-agregar-venta-web.component.html',
  styleUrls: ['./dialogo-agregar-venta-web.component.css']
})
export class DialogoAgregarVentaWebComponent {
  private productoService = inject(ProductoService)

  contador: number = 0;
  cliente: string = '';
  info: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.info = data;
  }

  sendInfo(): void {
    if (this.contador == 0 || this.cliente == '') {
      Swal.fire('Error', "No puedes dejar cliente vacio ni cantidad en 0", 'error')
    } else {
      const { usuario_ml_id, producto_id } = this.info;
      const cantidad_vendida = this.contador;
      const nombre_cliente = this.cliente;
      const body = { producto_id, usuario_ml_id, cantidad_vendida, nombre_cliente }
      this.productoService.postVentas(body)
        .subscribe(resp => {
          if (resp["ok"] === true) {
            Swal.fire('Excelente', resp["msg"], 'success')
          }
          else {
            Swal.fire('Error', "Error. hablar con el administrador", 'error')
          }
        })
    }
  }

  incrementar(): void {
    this.contador++;
  }

  descrementar(): void {
    if (this.contador > 0) this.contador--
  }
}
