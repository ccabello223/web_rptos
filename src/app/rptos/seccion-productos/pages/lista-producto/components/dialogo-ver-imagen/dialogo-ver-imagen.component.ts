import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FotoProducto } from 'src/app/rptos/seccion-productos/interfaces/models/foto_producto';
import { carouselImage } from 'src/app/shared/utils/carousel_image.interface';
import { ListaProductoService } from '../../services/lista-producto.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dialogo-ver-imagen',
  templateUrl: './dialogo-ver-imagen.component.html',
  styles: [
  ]
})
export class DialogoVerImagenComponent {
  private productoService = inject(ListaProductoService);
  private productoId: number = 0;
  public fotoProducto: carouselImage[] = [];
  constructor(@Inject(MAT_DIALOG_DATA) public data: {productoid: number; fotosProductos: FotoProducto[]}) {
    
    //Id del producto
    this.productoId = data.productoid;

    //Array de las fotos
    data.fotosProductos.map(e => {
      this.fotoProducto.push(
        {
          idImage: e.id,
          imageSrc:  `https://coreanosrptos.com/api/foto_producto/uploads/${e.img}`,
          imageAlt: e.img
        }
      );
    });
  }

  cargarFotoProducto(images: File[]){
    console.log(images);
    const formData = new FormData();
    for (const file of images) {
      formData.append('images', file, file.name);
    }

    this.productoService.postFotosProducto(formData, this.productoId)
    .subscribe( resp => {
      Swal.fire('Excelente', resp["message"], ( resp["ok"] ) ? 'success' : 'error')
    });
   }
}

