import { Component, OnInit, ViewChild, computed, inject } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { Producto, Usuario } from '../../interface/interface';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-lista-mercadolibre',
  templateUrl: './lista-mercadolibre.component.html',
  styleUrls: ['./lista-mercadolibre.component.css']
})
export class ListaMercadolibreComponent implements OnInit {

  private authService = inject(AuthService)
  private productoService = inject(ProductoService)

  //id del la tabla usuarios_mercadolibre
  id: number = 0;
  products: any[] = [];
  productsTemp: any[] = [];
  users: Usuario[] = [];
  isLoading = false;
  message: string = '';
  selectedFile?: File;
  dataSource!: MatTableDataSource<Usuario>;
  dataSourceTemp!: MatTableDataSource<Producto>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;


  usersML: string[] = ['id', 'nombre', 'correo'];
  productsML: string[] = ['id', 'nombre', 'codigo', 'marca', 'precio1', 'precio2', 'precio1_porc', 'precio2_porc']
  public user = computed(() => this.authService.usuarioActual());
  
  constructor() { }

  ngOnInit(): void {
    if(this.user()?.rol == 1 || this.user()?.rol == 6){
      this.dataSource = new MatTableDataSource(this.products);
      this.productoService.getUsuariosML().subscribe(resp => {
        this.users = Array.from({ length: resp.usuarios.length }, (_, k) => this.createNewUser(k, resp.usuarios));
        this.dataSource = new MatTableDataSource(this.users);
      })
    }else if(this.user()?.rol != 3){
      this.dataSource = new MatTableDataSource(this.products);
      this.productoService.getUsuariosML(this.user()?.usuario).subscribe(resp => {
        this.users = Array.from({ length: resp.usuarios.length }, (_, k) => this.createNewUser(k, resp.usuarios));
        this.dataSource = new MatTableDataSource(this.users);
      })
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  //Cuando el usuario selecciona un empleado entonces se cargar los productos
  selectedUser(id:number) {
    this.id = id;
    this.dataSource = new MatTableDataSource(this.products);
    this.dataSourceTemp = new MatTableDataSource(this.productsTemp);

    this.productoService.getProductosML(this.id).subscribe(resp => {
      this.products = Array.from({ length: resp.productos.length }, (_, k) => this.productOfUserById(k, resp.productos));
      this.dataSource.data = this.products;
      this.dataSource.paginator = this.paginator;
    });

    this.productoService.getProductosmlTemp(this.id).subscribe(resp => {
      this.productsTemp = Array.from({ length: resp.productos.length }, (_, k) => this.productOfUserById(k, resp.productos));
      this.dataSourceTemp.data = this.productsTemp;
    });
  }

  selectedProduct(id:number){
    Swal.fire({
      title: '¿Estás seguro de borrar este artículo?',
      text: "¡Este cambio no podrá ser revertido!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar'
    }).then((result:any) => {
      if (result.isConfirmed) {
        this.productoService.deleteProduct(id).subscribe(resp => {
          if(resp["ok"] == true){
            Swal.fire(
              'Borrado!',
              resp["msg"],
              'success'
            );
            this.selectedUser(this.id);
          }else{
            Swal.fire(
              'Error!',
              resp["errorMsg"],
              'error'
            );
          }
        })
      }
    })
  }

  selectedProductTemp(id:number){
    Swal.fire({
      title: '¿Estás seguro de montar este artículo?',
      text: "Usted esta realmente consiente que este acto quiere decir que dicho producto que seleccionó\
            ya fue montado o actualizado el precio en MercadoLibre. ¿Aun así quiere continuar?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, quiero continuar'
    }).then((result:any) => {
      if (result.isConfirmed) {
        // el primer id representa el id en la tabla producto_mercadolibre_temp
        // el segundo es el id del usuarios_mercadolibre
        this.productoService.getProductoML(id, this.id).subscribe(resp => {
          if(resp["ok"] == true){
            Swal.fire(
              'Cargado!',
              resp["msg"],
              'success'
            );
            this.selectedUser(this.id);
          }else{
            Swal.fire(
              'Error!',
              resp["errorMsg"],
              'error'
            );
          }
        })
      }
    })
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
      this.productoService.postExcelProduct(this.id, this.selectedFile, this.user()?.rol)
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
  createNewUser(id: number, usuarios: Usuario[]): any {
    return {
      id: usuarios[id].id,
      nombre: usuarios[id].empleado.nombre,
      correo: usuarios[id].correo,
      estado: usuarios[id].estado
    }
  }

  productOfUserById(i: number, products: Producto[]): any {
    return {
      id: products[i].id,
      id_producto:products[i].id_producto,
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
