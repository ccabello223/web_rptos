import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { ProductoService } from '../../services/producto.service';
import { ProductoElement } from '../../interface/interface';

export interface ProductoTabla {
  id: number;
  codigo: string;
  descripcion: string;
  marca: string;
}

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
  
  producto!: ProductoElement[];
  
  displayedColumns: string[] = ['id', 'codigo', 'descripción', 'marca'];
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
      this.producto = resp.producto
      // console.log(resp.producto);
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
  createNewUser(id: number): ProductoTabla{
    return {
      id: this.producto[id].idproducto,
      codigo: this.producto[id].codigo,
      descripcion: this.producto[id].nombre,
      marca: this.producto[id].categorium.nombre,
    }
  }
}

