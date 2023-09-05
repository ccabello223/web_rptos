import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { ListaProductoWebService } from '../../services/lista-producto-web.service';
import { ItemsVenta } from 'src/app/rptos/seccion-productos/interfaces';
import { FotoComprobante } from 'src/app/rptos/seccion-productos/interfaces/models/foto_comprobante_pago';
import { Router } from '@angular/router';

interface ItemVentaWeb{
  idproducto:number;
  codigo:string;
  descripcion:string;
  marca:string;
  cantidad:number;
}

@Component({
  selector: 'app-dialogo-detalle-venta',
  templateUrl: './dialogo-detalle-venta.component.html',
  styleUrls: ['./dialogo-detalle-venta.component.css']
})
export class DialogoDetalleVentaComponent {
  private productoService = inject(ListaProductoWebService);

  itemsVentaWeb: ItemsVenta[] = [];
  fotosComprobante: FotoComprobante[] = [];
  displayedColumns: string[] = ['idproducto', 'codigo', 'descripción', 'marca', 'cantidad'];

  dataSource!: MatTableDataSource<ItemVentaWeb>;

  constructor(@Inject(MAT_DIALOG_DATA) public data: number) {
    this.productoService.getItemsVentasWeb(data).subscribe(resp => {
      this.itemsVentaWeb = resp.itemsVentas
      const items = Array.from({length: this.itemsVentaWeb.length}, (_, k) => this.crearItemsVentas(k))
      this.dataSource = new MatTableDataSource(items)
    });

    this.productoService.getFotosComprobante(data)
      .subscribe( resp => {
        this.fotosComprobante = resp;
      });
  }
  /** Construye y retorna los items de las ventas. */
  crearItemsVentas(i: number): ItemVentaWeb {
  return {
      idproducto:this.itemsVentaWeb[i].producto.idproducto,
      codigo:this.itemsVentaWeb[i].producto.codigo,
      descripcion:this.itemsVentaWeb[i].producto.nombre,
      marca:this.itemsVentaWeb[i].producto.marca.nombre,
      cantidad:this.itemsVentaWeb[i].cantidad_vendida
    }
  }

  cargarArchivos(images: File[]){

    const formData = new FormData();
    for (const file of images) {
      formData.append('images', file, file.name);
    }

    this.productoService.postFotosComprobante(formData, this.data)
    .subscribe( resp => {
      Swal.fire('Excelente', resp["message"], ( resp["ok"] ) ? 'success' : 'error')
    });

  }

  goingToImagen(term: string):void{
    window.open(`https://coreanosrptos.com/api/foto_comprobante/uploads/${term}`, '_blank');
  }
}