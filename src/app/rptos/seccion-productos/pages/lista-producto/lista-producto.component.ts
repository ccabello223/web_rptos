import { SelectionModel } from '@angular/cdk/collections';
import { Component, ViewChild, computed, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import Swal from 'sweetalert2';
import { DialogoAgregarProductosWebsComponent } from './components/dialogo-agregar-productos-webs/dialogo-agregar-productos-webs.component';
import { DialogoNotaProductoComponent } from './components/dialogo-nota-producto/dialogo-nota-producto.component';
import { ListaProductoService } from './services/lista-producto.service';
import { Producto, ProductoTabla } from '../../interfaces';

@Component({
  selector: 'app-lista-producto',
  templateUrl: './lista-producto.component.html',
  styleUrls: ['./lista-producto.component.css']
})
export class ListaProductoComponent {
  private dialog = inject(MatDialog)
  private router = inject(Router);
  private authService = inject(AuthService)
  private productoService = inject(ListaProductoService);

  producto!: Producto[];

  isLoading = false;
  message: string = '';
  distid?: string = '';
  selectedFile?: File;
  selection = new SelectionModel<ProductoTabla>(true, []);
  selectedRows: ProductoTabla[] = [];
  showButton: boolean = false;


  displayedColumns: string[] = ['checkbox', 'id', 'codigo', 'descripción', 'marca', 'precio2', 'notas'];
  dataSource!: MatTableDataSource<ProductoTabla>;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  public user = computed(() => this.authService.usuarioActual());

  constructor() {

  }
  ngOnInit(): void {
    this.getProductsFromBBDD()
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
    return {
      id: this.producto[i].idproducto,
      codigo: this.producto[i].codigo,
      descripcion: this.producto[i].nombre,
      marca: this.producto[i].marca.nombre,
      precio1: this.producto[i].precio1,
      precio2: this.producto[i].precio2
    }
  }

  openDialog(element: any) {
    this.dialog.open(DialogoNotaProductoComponent, {
      data: element.id,
    })
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onUpload() {
    if (this.selectedFile == undefined) {
      Swal.fire('Error', "No ha subido ningún archivo!", 'error')
    } else {
      this.isLoading = true;
      this.productoService.postExcelProduct(this.selectedFile)
        .subscribe(resp => {
          if (resp["ok"] === true) {
            this.getProductsFromBBDD();
            Swal.fire('Todo correcto!!', resp["msg"], 'success')
          }
          else {
            Swal.fire('Error', "Sucedió un error. Notificar a administración", 'error')
          }
          this.isLoading = false;
        })
    }
  }

  downloadExcel(): void {
    window.location.href = `${this.productoService.getBaseUrl}/productos/downloadExcel`;
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: ProductoTabla): string {
    if (!row) {
      return '';
    }
    if (this.selection.isSelected(row)) {
      console.log(row);
      return row.descripcion;
    }
    return `${this.selection.isSelected(row) ? 'select' : 'deselect'} row ${row.id}`;
    // console.log(`${this.selection.isSelected(row) ? 'select' : 'deselect'} row ${row.id}`);
  }

  onRowSelect(event:any, row:any) {
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

  saveSelectedRows() {
    console.log(this.selectedRows);
    this.dialog.open(DialogoAgregarProductosWebsComponent, {
      data: this.selectedRows,
    })
  }
}
