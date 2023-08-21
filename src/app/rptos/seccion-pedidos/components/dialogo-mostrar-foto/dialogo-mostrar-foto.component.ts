import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SeccionPedidosService } from '../../services/seccion-pedidos.service';
import { FotoPedidoAlmacen } from '../../interfaces/models/foto_pedido_almacen';

@Component({
  selector: 'app-dialogo-mostrar-foto',
  templateUrl: './dialogo-mostrar-foto.component.html',
  styleUrls: ['./dialogo-mostrar-foto.component.css']
})
export class DialogoMostrarFotoComponent {
  private pedidoAlmacenService = inject(SeccionPedidosService);
  public fotoPedidoAlmacen: FotoPedidoAlmacen[] = [];
  selectedFiles: File[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: number) {
    this.pedidoAlmacenService.getFotosPedidoAlmacen(data)
    .subscribe(resp => {
      this.fotoPedidoAlmacen = resp;
    })
  }

  goingToImagen(term: string):void{
    window.open(`https://coreanosrptos.com/api/foto_pedido_almacen/uploads/${term}`, '_blank');
    // window.open(`http://localhost:8000/api/foto_pedido_almacen/uploads/${term}`, '_blank');
  }
}
