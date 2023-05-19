import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { Producto, Usuario } from '../../interface/interface';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-lista-mercadolibre',
  templateUrl: './lista-mercadolibre.component.html',
  styleUrls: ['./lista-mercadolibre.component.css']
})
export class ListaMercadolibreComponent implements OnInit {

  id:number = 0;
  dataSource!: MatTableDataSource<Usuario>;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;


  usersML: string[] = ['id', 'nombre', 'correo'];
  productsML: string[] = ['id', 'nombre', 'codigo', 'marca', 'precio1', 'precio2', 'precio1_porc', 'precio2_porc']
  // clickedRows = new Set<Usuario>();

  constructor(private productoService: ProductoService){}

  ngOnInit(): void {
    this.productoService.getUsuariosML().subscribe(resp => {
      const users = Array.from({length: resp.usuarios.length}, (_, k) => this.createNewUser(k, resp.usuarios));
      this.dataSource = new MatTableDataSource(users);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  metodo(row:Usuario){
    this.id = row.id;
    this.productoService.getProductosML(this.id).subscribe(resp => {
      const products = Array.from({length: resp.productos.length}, (_, k) => this.productOfUserById(k, resp.productos));
      this.dataSource = new MatTableDataSource(products);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  searchFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /** Builds and returns a new User. */
  createNewUser(id: number, usuarios: Usuario[]): Usuario{
    return {
      id: usuarios[id].id,
      nombre: usuarios[id].nombre,
      correo: usuarios[id].correo,
      estado: usuarios[id].estado
    }
  }

  productOfUserById(i: number, products: Producto[]): any{
    return {
      id: products[i].id,
      nombre: products[i].nombre,
      codigo: products[i].codigo,
      precio1: products[i].precio1,
      precio2: products[i].precio2,
      precio1_porc: products[i].precio1_porc,
      precio2_porc: products[i].precio2_porc,
      marca: products[i].marca.nombre,
    }
  }
}
