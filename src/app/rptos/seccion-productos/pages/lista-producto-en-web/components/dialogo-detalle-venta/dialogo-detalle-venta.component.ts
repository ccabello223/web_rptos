import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { ListaProductoWebService } from '../../services/lista-producto-web.service';
import { ItemsVenta } from 'src/app/rptos/seccion-productos/interfaces';

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
  private productoService = inject(ListaProductoWebService)

  itemsVentaWeb: ItemsVenta[] = [];
  selectedFiles: File[] = [];
  displayedColumns: string[] = ['idproducto', 'codigo', 'descripción', 'marca', 'cantidad'];

  dataSource!: MatTableDataSource<ItemVentaWeb>;

  constructor(@Inject(MAT_DIALOG_DATA) public data: number) {
    this.productoService.getItemsVentasWeb(data).subscribe(resp => {
      this.itemsVentaWeb = resp.itemsVentas
      const items = Array.from({length: this.itemsVentaWeb.length}, (_, k) => this.crearItemsVentas(k))
      this.dataSource = new MatTableDataSource(items)
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

  onFileSelected(event: any) {
    this.selectedFiles = event.target.files;
  }

  uploadImages() {
    if(this.selectedFiles.length === 0) return;

    // Aquí puedes realizar la lógica para enviar las imágenes al backend.
    // Puedes usar una librería como 'HttpClient' para realizar una petición HTTP al backend y enviar los archivos.
    // Ejemplo con HttpClient (requiere HttpClientModule importado en el módulo):
    const formData = new FormData();
    for (const file of this.selectedFiles) {
      formData.append('images', file, file.name);
    }

    this.productoService.postFotosComprobante(formData, this.data)
    .subscribe( resp => {
      Swal.fire('Excelente', resp["message"], ( resp["ok"] ) ? 'success' : 'error')
    });


    this.selectedFiles = [];
  }

  clearSelectedFiles(): void{
    this.selectedFiles = [];
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const dataTransfer = event.dataTransfer;
    if (dataTransfer?.files) {
      this.selectedFiles = Array.from(dataTransfer.files);
    }
  }

  prueba():void{
    console.log("Hola Mundo");
  }
}
