import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ListaProductoService } from '../../services/lista-producto.service';
import { ProductoHistorialPrecio } from 'src/app/rptos/seccion-productos/interfaces/models/producto_historial_precio';

@Component({
  selector: 'app-dialogo-producto-historial-precio',
  templateUrl: './dialogo-producto-historial-precio.component.html',
  styleUrls: ['./dialogo-producto-historial-precio.component.css']
})
export class DialogoProductoHistorialPrecioComponent {
  
  private productoService = inject(ListaProductoService);

  productos: ProductoHistorialPrecio[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: number) {
    this.productoService.getProductosHistorialPrecio(data).subscribe(resp => {
      this.productos = resp;
    })
  }


}
