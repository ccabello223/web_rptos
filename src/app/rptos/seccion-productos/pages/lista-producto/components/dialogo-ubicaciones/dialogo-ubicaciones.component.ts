import { Component, ElementRef, Inject, ViewChild, computed, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { ListaProductoService } from '../../services/lista-producto.service';
import { Ubicacion } from 'src/app/rptos/seccion-productos/interfaces/models/ubicaciones';
import { AuthService } from 'src/app/auth/services/auth.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ProductoTablaUbicaciones } from 'src/app/rptos/seccion-productos/interfaces/productoTablaUbicaciones';
import { DialogoAgregarUbicacionComponent } from '../dialogo-agregar-ubicacion/dialogo-agregar-ubicacion.component';
import { DialogoFotoUbicacionComponent } from '../dialogo-foto-ubicacion/dialogo-foto-ubicacion.component';

@Component({
  selector: 'app-dialogo-ubicaciones',
  templateUrl: './dialogo-ubicaciones.component.html',
  styles: [
  ]
})
export class DialogoUbicacionesComponent {


  private dialog = inject(MatDialog)
  private authService = inject(AuthService)
  private productoService = inject(ListaProductoService);


  public ubicaciones: Ubicacion[] = [];

  isLoading = false;
  message: string = '';
  selectedFile?: File;
  selection = new SelectionModel<ProductoTablaUbicaciones>(true, []);
  selectedRows: ProductoTablaUbicaciones[] = [];
  showButton: boolean = false;


  displayedColumns: string[] = ['checkbox', 'id', 'ubicacion', 'cantidad', 'fecha_modificacion', 'almacenista', 'imagenes'];
  dataSource!: MatTableDataSource<ProductoTablaUbicaciones>;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  public user = computed(() => this.authService.usuarioActual());


  constructor(@Inject(MAT_DIALOG_DATA) public data: { productoid: number; distid: string }) {
    this.searchUbicacion(this.data.productoid, this.data.distid);
  }

  ngOnDestroy(): void {
  }


  private searchUbicacion(productoid: number, distid: string): void {
    this.productoService.getUbicaciones(productoid, distid).subscribe(resp => {
      this.ubicaciones = resp.ubicaciones
      const users = Array.from({ length: this.ubicaciones.length }, (_, k) => this.createNewProducts(k));
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
  createNewProducts(i: number): ProductoTablaUbicaciones {
    let date: Date;
    return {
      id: this.ubicaciones[i].id,
      ubicacion: this.ubicaciones[i].ubicacion,
      cantidad: (this.ubicaciones[i].cantidad === null) ? 0 : this.ubicaciones[i].cantidad,
      fecha_modificacion: (this.ubicaciones[i].fecha_modificacion === null) ? '' : this.ubicaciones[i].fecha_modificacion,
      almacenista: (this.ubicaciones[i].almacenistum === null) ? '' : this.ubicaciones[i].almacenistum.nombre,
      foto_ubicacions: this.ubicaciones[i].foto_ubicacions
      
    }
  }

  openDialogoVerFoto(element: ProductoTablaUbicaciones) {
    //TODO: mandar el arreglo de imagenes al dialogo
    this.dialog.open(DialogoFotoUbicacionComponent, {
      data: {
        ubicacionId: element.id,
        fotosUbicacion: element.foto_ubicacions,
      }
    })
  }


  borrarUbicacion(row: ProductoTablaUbicaciones) {
    Swal.fire({
      title: '¿Estás seguro de borrar esta ubicación?',
      text: "¡Este cambio no podrá ser revertido!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.productoService.deleteUbicacion(row.id).subscribe(resp => {
          if (resp["ok"] == true) {
            Swal.fire('Borrado!', resp["msg"], 'success');
            this.searchUbicacion(this.data.productoid, this.data.distid);
          } else {
            Swal.fire('Error!', resp["errorMsg"], 'error');
          }
        })
      }
    })
  }

  agregarUbicacion():void{
    const dialogRef = this.dialog.open(DialogoAgregarUbicacionComponent, {
      data: {
        productoid: this.data.productoid,
        distid: this.data.distid
      },
    });

    // Manejar el resultado al cerrar el diálogo
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.searchUbicacion(this.data.productoid, this.data.distid);
      } else {
        console.log('Se canceló el cambio');
      }
    });
  }



  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: ProductoTablaUbicaciones): string {
    if (!row) {
      return '';
    }
    if (this.selection.isSelected(row)) {
      console.log(row);
      return row.ubicacion;
    }
    return `${this.selection.isSelected(row) ? 'select' : 'deselect'} row ${row.id}`;
    // console.log(`${this.selection.isSelected(row) ? 'select' : 'deselect'} row ${row.id}`);
  }

  onRowSelect(event: any, row: any) {
    if (event.checked) {
      this.selectedRows.push(row);
    } else {
      const index = this.selectedRows.indexOf(row);
      if (index > -1) {
        this.selectedRows.splice(index, 1);
      }
    }
    this.showButton = this.selectedRows.length > 0;
  }

  /*---------------

/** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      this.selectedRows = [];
      this.showButton = this.selectedRows.length > 0;
      return;
    }

    this.selection.select(...this.dataSource.data);
    this.selection.selected.forEach(element => {
      this.selectedRows.push(element);
    });
    //Habilita el boton para subir el producto
    this.showButton = this.selectedRows.length > 0;
  }


  // private productoService = inject(ListaProductoService)

  // @ViewChild('txtTagInput')
  // public tagInput!: ElementRef<HTMLInputElement>;

  // public ubicaciones: Ubicacion[] = [];

  // constructor(@Inject(MAT_DIALOG_DATA) public data: { productoid: number; distid: string }) {
  //   this.searchUbicacion();
  // }

  // private searchUbicacion():void{
  //   this.productoService.getUbicaciones(this.data.productoid, this.data.distid)
  //   .subscribe( resp => {
  //     this.ubicaciones = resp.ubicaciones
  //   })
  // }

  // borrarUbicacion(productoid:number):void{
  //   Swal.fire({
  //     title: '¿Estás seguro de borrar esta ubicación?',
  //     text: "¡Este cambio no podrá ser revertido!",
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Sí, borrar'
  //   }).then((result:any) => {
  //     if (result.isConfirmed) {
  //       this.productoService.deleteUbicacion(productoid).subscribe(resp => {
  //         if(resp["ok"] == true){
  //           Swal.fire('Borrado!', resp["msg"], 'success');
  //           this.searchUbicacion();
  //         }else{
  //           Swal.fire('Error!',resp["errorMsg"],'error');
  //         }
  //       })
  //     }
  //   })
  // }

  // valueOfInput(): void{
  //   const ubicacion = this.tagInput.nativeElement.value
  //   const body = { productoid: this.data.productoid, distid: this.data.distid, ubicacion }
  //   this.productoService.postUbicaciones(body)
  //   .subscribe( resp => {
  //     if(resp["ok"] === true){
  //       Swal.fire('Excelente', resp["msg"], 'success');
  //       this.searchUbicacion();
  //     }
  //     else{
  //       Swal.fire('Error', "Error. hablar con el administrador", 'error');
  //     }
  //   })
  // }
}
