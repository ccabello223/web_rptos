import {Component, OnInit, ViewChild, inject} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { ProductoService } from '../../services/producto.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogoNotasMlComponent } from '../../components/dialogo-notas/dialogo-notas.component';
import { Producto, ProductoTabla } from '../../interface';

@Component({
  selector: 'app-layout-page',
  templateUrl: './layout-page.component.html',
  styles: [
    `table {
      width: 100%;
    }
    
    .mat-mdc-form-field {
      font-size: 14px;
      width: 100%;
    }
    
    td, th {
      width: 25%;
    }`
  ]
})

export class LayoutPageComponent implements OnInit {

  public dialog = inject(MatDialog)
  
  producto!: Producto[];

  distid?:string = '';
  
  displayedColumns: string[] = ['id', 'codigo', 'descripción', 'marca', 'precio1', 'precio2', 'notas'];
  dataSource!: MatTableDataSource<ProductoTabla>;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(private productoService: ProductoService) {

  }
  ngOnInit(): void {
    this.iniciarValor()
  }

  iniciarValor() {
    this.productoService.getProducto().subscribe(resp => {
      this.producto = resp.productos
      const users = Array.from({length: this.producto.length}, (_, k) => this.createNewUser(k));
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
  /** Builds and returns a new User. */
  createNewUser(i: number): ProductoTabla{
    return {
      id: this.producto[i].idproducto,
      codigo: this.producto[i].codigo,
      descripcion: this.producto[i].nombre,
      marca: this.producto[i].marca.nombre,
      precio1: this.producto[i].precio1,
      precio2: this.producto[i].precio2
    }
  }

  openDialog(element:any){
    this.dialog.open(DialogoNotasMlComponent, {
      data: element.id,
    })
  }
}

