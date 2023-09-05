import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SeccionPedidosService } from '../../services/seccion-pedidos.service';
import { FotoPedidoAlmacen } from '../../interfaces/models/foto_pedido_almacen';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environments';

@Component({
  selector: 'app-dialogo-mostrar-foto',
  templateUrl: './dialogo-mostrar-foto.component.html',
  styleUrls: ['./dialogo-mostrar-foto.component.css']
})
export class DialogoMostrarFotoComponent {
  private pedidoAlmacenService = inject(SeccionPedidosService);
  public fotoPedidoAlmacen: FotoPedidoAlmacen[] = [];
  private baseUrl: string = environment.baseUrl;
  isLoading = false;
  selectedFiles: File[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: number) {
    this.pedidoAlmacenService.getFotosPedidoAlmacen(data)
    .subscribe(resp => {
      this.fotoPedidoAlmacen = resp;
    })
  }

  goingToImagen(term: FotoPedidoAlmacen):void{
    Swal.fire({
      title: '¿Qué quieres hacer con esta imagen?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Ver foto',
      denyButtonText: `Borrar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
          window.open(`https://coreanosrptos.com/api/foto_pedido_almacen/uploads/${term.img}`, '_blank');
      } else if (result.isDenied) {
        this.pedidoAlmacenService.borrarFotoPedido(term.id).subscribe(resp => {
          if(resp["ok"]){
            Swal.fire('Excelente', resp["msg"], 'success')
          }else{
            Swal.fire('Error', resp["msg"], 'error')
          }
        });
      }
    })
    // // window.open(`http://localhost:8000/api/foto_pedido_almacen/uploads/${term}`, '_blank');
  }

  cargarArchivos(images: File[]){

    //console.log(images);

    this.isLoading = true;

    const formData = new FormData();
    for (const file of images) {
      formData.append('images', file, file.name);
    }

    this.pedidoAlmacenService.postFotosPedidosAlmacen(formData, this.data)
    .subscribe( resp => {
      if(resp["ok"]){
        Swal.fire('Excelente', resp["message"], 'success')
        this.isLoading = false
      }
      else{
        Swal.fire('Hubo un error', resp["message"], 'error')
        this.isLoading = false
      }
    });

  }
}
