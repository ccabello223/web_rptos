import { Component, computed, inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/services/auth.service';
import Swal from 'sweetalert2';
import { ListaProductoService } from '../../services/lista-producto.service';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { ProductoTabla } from 'src/app/rptos/seccion-productos/interfaces/producto-table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Producto } from 'src/app/rptos/seccion-productos/interfaces/models/producto';
import { DialogoUbicacionesComponent } from '../../components/dialogo-ubicaciones/dialogo-ubicaciones.component';
import { DialogoVerImagenComponent } from '../../components/dialogo-ver-imagen/dialogo-ver-imagen.component';

@Component({
  selector: 'app-control-ubicaciones',
  templateUrl: './control-ubicaciones.component.html',
  styleUrls: ['./control-ubicaciones.component.css']
})
export class ControlUbicacionesComponent implements OnInit {

  private dialog = inject(MatDialog)
  private authService = inject(AuthService)
  private productoService = inject(ListaProductoService);
  


  producto: Producto[] = [];
  isLoading = false;
  message: string = '';
  distid?: string = '';
  selectedFile?: File;
  selection = new SelectionModel<ProductoTabla>(true, []);
  selectedRows: ProductoTabla[] = [];
  showButton: boolean = false;


  displayedColumns: string[] = ['id', 'codigo', 'descripción', 'marca', 'imagenes', 'ubicaciones'];
  dataSource!: MatTableDataSource<ProductoTabla>;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  public user = computed(() => this.authService.usuarioActual());

  constructor() {
  }

  get productos(): Producto[] {
    return this.productoService.producto;
  }


  ngOnInit(): void {
    this.getProductsFromBBDD()
  }

  ngOnDestroy(): void {
  }


  getProductsFromBBDD() {
    this.productoService.getProducto().subscribe(resp => {
      this.producto = resp.productos
      const users = Array.from({ length: this.producto.length }, (_, k) => this.createNewProducts(k));
      this.dataSource = new MatTableDataSource(users);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /** Builds and returns a new Products. */
  createNewProducts(i: number): ProductoTabla {
    let porcentaje = Number(this.producto[i].precio2) + (Number(this.producto[i].precio2) * 0.3)
    return {
      id: this.producto[i].idproducto,
      codigo: this.producto[i].codigo,
      descripcion: this.producto[i].nombre,
      marca: (this.producto[i].marca === null) ? 'Sin marca' : this.producto[i].marca.nombre,
      precio1: this.producto[i].precio1,
      precio2: this.producto[i].precio2,
      porcentaje30: (parseFloat(porcentaje.toString())).toFixed(4) + '$',
      foto_producto: this.producto[i].foto_productos
    }
  }


  openDialogUbicaciones(element: any) {
    this.dialog.open(DialogoUbicacionesComponent, {
      data: {
        productoid: element.id,
        distid: this.user()?.distid
      },
    })
  }

  openDialogoVerFoto(element: ProductoTabla) {
    //TODO: mandar el arreglo de imagenes al dialogo
    this.dialog.open(DialogoVerImagenComponent, {
      data: {
        productoid: element.id,
        fotosProductos: element.foto_producto,
        tieneFoto: true
      }
    })
  }



//   /** The label for the checkbox on the passed row */
//   checkboxLabel(row?: ProductoTabla): string {
//     if (!row) {
//       return '';
//     }
//     if (this.selection.isSelected(row)) {
//       console.log(row);
//       return row.descripcion;
//     }
//     return `${this.selection.isSelected(row) ? 'select' : 'deselect'} row ${row.id}`;
//     // console.log(`${this.selection.isSelected(row) ? 'select' : 'deselect'} row ${row.id}`);
//   }

//   onRowSelect(event: any, row: any) {
//     if (event.checked) {
//       this.selectedRows.push(row);
//     } else {
//       const index = this.selectedRows.indexOf(row);
//       if (index > -1) {
//         this.selectedRows.splice(index, 1);
//       }
//     }
//     this.showButton = this.selectedRows.length > 0;
//   }

//   saveSelectedRows() {
//     this.dialog.open(DialogoAgregarProductosWebsComponent, {
//       data: this.selectedRows,
//     })
//   }

//   deleteProductSelected() {
//     let productosABorrar: number[] = [];
//     this.selectedRows.forEach(element => {
//       productosABorrar.push(element.id);
//     })
//     Swal.fire({
//       title: '¿Estás seguro de borrar este artículo?',
//       text: "¡Este cambio no podrá ser revertido!",
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#3085d6',
//       cancelButtonColor: '#d33',
//       confirmButtonText: 'Sí, borrar'
//     }).then((result:any) => {
//       if (result.isConfirmed) {
//         this.productoService.deleteProducts(productosABorrar).subscribe(resp => {
//           if(resp["ok"] == true){
//             Swal.fire(
//               'Borrado!',
//               resp["msg"],
//               'success'
//             );
//             this.getProductsFromBBDD();
//           }else{
//             Swal.fire(
//               'Error!',
//               resp["errorMsg"],
//               'error'
//             );
//           }
//         })
//       }
//     });
    
//   }

//   /*---------------

// /** Whether the number of selected elements matches the total number of rows. */
//   isAllSelected() {
//     const numSelected = this.selection.selected.length;
//     const numRows = this.dataSource.data.length;
//     return numSelected === numRows;
//   }

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

}
