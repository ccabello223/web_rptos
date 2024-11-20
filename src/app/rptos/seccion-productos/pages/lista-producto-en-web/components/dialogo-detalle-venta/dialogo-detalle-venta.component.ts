import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { ListaProductoWebService } from '../../services/lista-producto-web.service';
import { ItemsVenta } from 'src/app/rptos/seccion-productos/interfaces';
import { FotoComprobante } from 'src/app/rptos/seccion-productos/interfaces/models/foto_comprobante_pago';
import { Router } from '@angular/router';
import { carouselImage } from 'src/app/shared/utils/carousel_image.interface';
import { SelectionModel } from '@angular/cdk/collections';

interface ItemVentaWeb{
  idproducto:number;
  codigo:string;
  descripcion:string;
  marca:string;
  cantidad:number;
  estado_venta:string;
}

@Component({
  selector: 'app-dialogo-detalle-venta',
  templateUrl: './dialogo-detalle-venta.component.html',
  styleUrls: ['./dialogo-detalle-venta.component.css']
})
export class DialogoDetalleVentaComponent {
  private productoService = inject(ListaProductoWebService);

  itemsVentaWeb: ItemsVenta[] = [];
  fotosComprobante: carouselImage[] = [];
  fotosProductoVenta: carouselImage[] = [];
  selectedRows: ItemVentaWeb[] = [];
  selection = new SelectionModel<ItemVentaWeb>(true, []);
  showButton: boolean = false;
  // displayedColumns: string[] = ['checkbox', 'idproducto', 'codigo', 'descripción', 'marca', 'cantidad', 'estado'];
  displayedColumns: string[] = ['idproducto', 'codigo', 'descripción', 'marca', 'cantidad', 'estado'];

  dataSource!: MatTableDataSource<ItemVentaWeb>;

  constructor(@Inject(MAT_DIALOG_DATA) public data: number) {
    this.productoService.getItemsVentasWeb(data).subscribe(resp => {
      this.itemsVentaWeb = resp.itemsVentas
      const items = Array.from({length: this.itemsVentaWeb.length}, (_, k) => this.crearItemsVentas(k))
      this.dataSource = new MatTableDataSource(items)
    });

    this.productoService.getFotosComprobante(data)
      .subscribe( resp => {
          resp.map(e => {
            this.fotosComprobante.push(
              {
                idImage: e.id,
                imageSrc: `https://coreanosrptos.com/api/foto_comprobante/uploads/${e.img}`,
                imageAlt: e.img
              }
            )
          });
      });

      this.productoService.getFotosProductosVentas(data)
      .subscribe( resp => {
        resp.map( e => {
          this.fotosProductoVenta.push(
            {
              idImage: e.id,
              imageSrc: `https://coreanosrptos.com/api/foto_producto_venta/uploads/${e.img}`,
              imageAlt: e.img
            }
          )
        })
      })
  }
  /** Construye y retorna los items de las ventas. */
  crearItemsVentas(i: number): ItemVentaWeb {
  return {
      idproducto:this.itemsVentaWeb[i].producto.idproducto,
      codigo:this.itemsVentaWeb[i].producto.codigo,
      descripcion:this.itemsVentaWeb[i].producto.nombre,
      marca:this.itemsVentaWeb[i].producto.marca.nombre,
      cantidad:this.itemsVentaWeb[i].cantidad_vendida,
      estado_venta:this.itemsVentaWeb[i].estado_venta,
    }
  }

  cargarFotoComprobante(images: File[]){

    const formData = new FormData();
    for (const file of images) {
      formData.append('images', file, file.name);
    }

    this.productoService.postFotosComprobante(formData, this.data)
    .subscribe( resp => {
      Swal.fire('Excelente', resp["message"], ( resp["ok"] ) ? 'success' : 'error')
    });
  }

  cargarFotoProductoVente(images: File[]){
    const formData = new FormData();
    for (const file of images) {
      formData.append('images', file, file.name);
    }

    this.productoService.postFotosProductosVentas(formData, this.data)
    .subscribe( resp => {
      Swal.fire('Excelente', resp["message"], ( resp["ok"] ) ? 'success' : 'error')
    });
  }

  goingToImagen(term: string):void{
    window.open(`https://coreanosrptos.com/api/foto_comprobante/uploads/${term}`, '_blank');
  }

    //Cuando el usuario selecciona un empleado entonces se cargar los productos
    selectedUser(id_usuario_ml: number) {
      Swal.fire({
        title: "Digite estado",
        inputValue: 'Carlos',
        input: "text",
        inputAttributes: {
          autocapitalize: "off"
        },
        showCancelButton: true,
        confirmButtonText: "Look up",
        showLoaderOnConfirm: true,
        preConfirm: async (login) => {
          try {
            const githubUrl = `
              https://api.github.com/users/${login}
            `;
            const response = await fetch(githubUrl);
            if (!response.ok) {
              return Swal.showValidationMessage(`
                ${JSON.stringify(await response.json())}
              `);
            }
            return response.json();
          } catch (error) {
            Swal.showValidationMessage(`
              Request failed: ${error}
            `);
          }
        },
        allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: `${result.value.login}'s avatar`,
            imageUrl: result.value.avatar_url
          });
        }
      });
    }

  // // TODO ESTO ES LOGICA DEL CHECKBOX //

  //   /** Selects all rows if they are not all selected; otherwise clear selection. */
  //   toggleAllRows() {
  //     if (this.isAllSelected()) {
  //       this.selection.clear();
  //       this.selectedRows = [];
  //       this.showButton = this.selectedRows.length > 0;
  //       return;
  //     }
  
  //     this.selection.select(...this.dataSource.data);
  //     this.selection.selected.forEach(element => {
  //       this.selectedRows.push(element);
  //     });
  //     //Habilita el boton para subir el producto
  //     this.showButton = this.selectedRows.length > 0;
  //   }

  //   /** Whether the number of selected elements matches the total number of rows. */
  // isAllSelected() {
  //   const numSelected = this.selection.selected.length;
  //   const numRows = this.dataSource.data.length;
  //   return numSelected === numRows;
  // }

  // onRowSelect(event: any, row: any) {
  //   if (event.checked) {
  //     this.selectedRows.push(row);
  //   } else {
  //     const index = this.selectedRows.indexOf(row);
  //     if (index > -1) {
  //       this.selectedRows.splice(index, 1);
  //     }
  //   }
  //   this.showButton = this.selectedRows.length > 0;
  // }

  //   /** The label for the checkbox on the passed row */
  //   checkboxLabel(row?: ItemVentaWeb): string {
  //     if (!row) {
  //       return '';
  //     }
  //     if (this.selection.isSelected(row)) {
  //       console.log(row);
  //       return row.descripcion;
  //     }
  //     return `${this.selection.isSelected(row) ? 'select' : 'deselect'} row ${row.idproducto}`;
  //     // console.log(`${this.selection.isSelected(row) ? 'select' : 'deselect'} row ${row.id}`);
  //   }

  //   //FIN DE TODO LO QUE NECESITA LA LOGICA DEL CHECKBOX
}