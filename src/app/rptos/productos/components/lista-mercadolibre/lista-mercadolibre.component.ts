import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { Producto, Usuario } from '../../interface/interface';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista-mercadolibre',
  templateUrl: './lista-mercadolibre.component.html',
  styleUrls: ['./lista-mercadolibre.component.css']
})
export class ListaMercadolibreComponent implements OnInit {

  id: number = 0;
  products: any[] = [];
  users: Usuario[] = [];
  isLoading = false;
  message: string = '';
  selectedFile?: File;
  dataSource!: MatTableDataSource<Usuario>;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;


  usersML: string[] = ['id', 'nombre', 'correo'];
  productsML: string[] = ['id', 'nombre', 'codigo', 'marca', 'precio1', 'precio2', 'precio1_porc', 'precio2_porc']

  constructor(private productoService: ProductoService) { }

  ngOnInit(): void {

    this.dataSource = new MatTableDataSource(this.products);

    this.productoService.getUsuariosML().subscribe(resp => {
      this.users = Array.from({ length: resp.usuarios.length }, (_, k) => this.createNewUser(k, resp.usuarios));
      this.dataSource = new MatTableDataSource(this.users);
    })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  //Cuando el usuario selecciona un empleado entonces se cargar los productos
  selectedUser(id:number) {
    this.id = id;
    this.dataSource = new MatTableDataSource(this.products);

    this.productoService.getProductosML(this.id).subscribe(resp => {
      this.products = Array.from({ length: resp.productos.length }, (_, k) => this.productOfUserById(k, resp.productos));
      this.dataSource.data = this.products;
      this.dataSource.paginator = this.paginator;
    });
  }

  selectUserAgain(): void {
    this.id = 0;
    this.dataSource = new MatTableDataSource(this.users);
  }


  onUpload() {
    if (this.selectedFile == undefined) {
      Swal.fire('Error', "No ha subido ningún archivo!", 'error')
    } else {
      this.isLoading = true;
      this.message = "Cargando/Actulizando productos. Espere un momento por favor."
      this.productoService.postExcelProduct(this.id, this.selectedFile)
        .subscribe(resp => {
          if (resp["ok"] === true) {
            this.selectedUser(this.id);
            Swal.fire('Todo correcto!!', resp["msg"], 'success')
          }
          else {
            Swal.fire('Error', "Sucedió un error. Notificar a administración", 'error')
          }
          this.isLoading = false;
        })
    }
  }

  searchFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  /** Builds and returns a new User. */
  createNewUser(id: number, usuarios: Usuario[]): Usuario {
    return {
      id: usuarios[id].id,
      nombre: usuarios[id].nombre,
      correo: usuarios[id].correo,
      estado: usuarios[id].estado
    }
  }

  productOfUserById(i: number, products: Producto[]): any {
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