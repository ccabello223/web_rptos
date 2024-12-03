import { Component, inject, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FotoProducto } from 'src/app/rptos/seccion-productos/interfaces/models/foto_producto';
import { FotoUbicacion } from 'src/app/rptos/seccion-productos/interfaces/models/foto_ubicacion';
import { carouselImage } from 'src/app/shared/utils/carousel_image.interface';
import Swal from 'sweetalert2';
import { ListaProductoWebService } from '../../../lista-producto-en-web/services/lista-producto-web.service';
import { ListaProductoService } from '../../services/lista-producto.service';

@Component({
  selector: 'app-dialogo-foto-ubicacion',
  templateUrl: './dialogo-foto-ubicacion.component.html',
  styleUrls: ['./dialogo-foto-ubicacion.component.css']
})
export class DialogoFotoUbicacionComponent implements OnInit {

  private productoService = inject(ListaProductoService);
  private ubicacionId: number = 0;
  public fotoUbicacion: carouselImage[] = [];
  public fotosUbicacionByHttp: FotoUbicacion[] = [];
  constructor(@Inject(MAT_DIALOG_DATA) public data: { ubicacionId: number; fotosUbicacion: FotoUbicacion[] }) {

    //Id del producto
    this.ubicacionId = data.ubicacionId;
      //Array de las fotos
      data.fotosUbicacion.map(e => {
        this.fotoUbicacion.push(
          {
            idImage: e.id,
            imageSrc: `https://coreanosrptos.com/api/foto_ubicacion/uploads/${e.img}`,
            imageAlt: e.img
          }
        );
      });
    
  }
  ngOnInit(): void {

  }

  cargarFotoUbicacion(images: File[]) {
    const formData = new FormData();
    for (const file of images) {
      formData.append('images', file, file.name);
    }

    this.productoService.postFotosUbicacion(formData, this.ubicacionId)
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
