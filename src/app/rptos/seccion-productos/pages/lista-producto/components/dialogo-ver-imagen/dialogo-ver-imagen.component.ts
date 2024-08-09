import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FotoProducto } from 'src/app/rptos/seccion-productos/interfaces/models/foto_producto';
import { carouselImage } from 'src/app/shared/utils/carousel_image.interface';
import { ListaProductoService } from '../../services/lista-producto.service';
import Swal from 'sweetalert2';
import { ListaProductoWebService } from '../../../lista-producto-en-web/services/lista-producto-web.service';

@Component({
  selector: 'app-dialogo-ver-imagen',
  templateUrl: './dialogo-ver-imagen.component.html',
  styles: [
  ]
})
export class DialogoVerImagenComponent {
  private productoService = inject(ListaProductoService);
  private productoWebService = inject(ListaProductoWebService);
  private productoId: number = 0;
  public fotoProducto: carouselImage[] = [];
  public fotosProductoByHttp: FotoProducto[] = [];
  constructor(@Inject(MAT_DIALOG_DATA) public data: { productoid: number; fotosProductos: FotoProducto[]; tieneFoto: boolean; }) {

    //Id del producto
    this.productoId = data.productoid;

    if (data.tieneFoto == false) {
      this.productoWebService.getFotosProductoById(this.productoId).
        subscribe(resp => {
          this.fotosProductoByHttp = resp.foto_producto;
          // Array de las fotos
          this.fotosProductoByHttp.map(e => {
            this.fotoProducto.push(
              {
                idImage: e.id,
                imageSrc: `https://coreanosrptos.com/api/foto_producto/uploads/${e.img}`,
                imageAlt: e.img
              }
            );
          });
        })
    } else {
      //Array de las fotos
      data.fotosProductos.map(e => {
        this.fotoProducto.push(
          {
            idImage: e.id,
            imageSrc: `https://coreanosrptos.com/api/foto_producto/uploads/${e.img}`,
            imageAlt: e.img
          }
        );
      });
    }
  }

  cargarFotoProducto(images: File[]) {
    console.log(images);
    const formData = new FormData();
    for (const file of images) {
      formData.append('images', file, file.name);
    }

    this.productoService.postFotosProducto(formData, this.productoId)
      .subscribe(resp => {
        Swal.fire('Excelente', resp["message"], (resp["ok"]) ? 'success' : 'error')
      });
  }

  borrarImagen(id:number){
    Swal.fire({
      title: '¿Estás seguro de borrar esta imagen?',
      showCancelButton: true,
      confirmButtonText: 'Borrar Imagen',
    }).then((result) => {
      if (result.isConfirmed) {
        this.productoService.deleteBorrarFoto(id).subscribe(resp => {
          if(resp["ok"]){
            Swal.fire('Excelente', resp["msg"], 'success')
          }else{
            Swal.fire('Error', resp["msg"], 'error')
          }
        });
      } else if (result.isDenied) {
        
      }
    })
  }
}

