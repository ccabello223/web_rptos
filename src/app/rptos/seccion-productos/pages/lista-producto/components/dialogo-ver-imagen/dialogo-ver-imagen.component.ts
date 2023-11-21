import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FotoProducto } from 'src/app/rptos/seccion-productos/interfaces/models/foto_producto';
import { carouselImage } from 'src/app/shared/utils/carousel_image.interface';

@Component({
  selector: 'app-dialogo-ver-imagen',
  templateUrl: './dialogo-ver-imagen.component.html',
  styles: [
  ]
})

export class DialogoVerImagenComponent {
  public fotoProducto: carouselImage[] = [];
  constructor(@Inject(MAT_DIALOG_DATA) public data: FotoProducto[]) {
    data.map(e => {
      this.fotoProducto.push(
        {
          idImage: e.id,
          imageSrc:  `https://coreanosrptos.com/api/foto_producto/uploads/${e.img}`,
          imageAlt: e.img
        }
      );
    });
  }
}

