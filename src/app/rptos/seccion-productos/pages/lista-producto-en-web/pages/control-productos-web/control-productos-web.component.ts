import { Component, ViewChild, computed, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ProductoWebsTable, Usuario } from 'src/app/rptos/seccion-productos/interfaces';
import Swal from 'sweetalert2';
import { DialogoNotaProductoComponent } from '../../../lista-producto/components/dialogo-nota-producto/dialogo-nota-producto.component';
import { DialogoAgregarVentaWebComponent } from '../../components/dialogo-agregar-venta-web/dialogo-agregar-venta-web.component';
import { SelectionModel } from '@angular/cdk/collections';
import { ListaProductoWebService } from '../../services/lista-producto-web.service';
import { Productosml } from 'src/app/rptos/seccion-productos/interfaces/producto-webs-response';
import { DialogoPorcentajeComponent } from '../../components/dialogo-porcentaje/dialogo-porcentaje.component';
import { DialogoVerImagenComponent } from '../../../lista-producto/components/dialogo-ver-imagen/dialogo-ver-imagen.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogoAgregarUsuarioMlComponent } from '../../components/dialogo-agregar-usuario-ml/dialogo-agregar-usuario-ml.component';
import { UsuariosWeb } from 'src/app/rptos/seccion-productos/interfaces/models/usuarios_web';
import { UsuariosmlTable } from 'src/app/rptos/seccion-productos/interfaces/usuariosml-table';

@Component({
  selector: 'app-control-productos-web',
  templateUrl: './control-productos-web.component.html',
  styleUrls: ['./control-productos-web.component.css']
})
export class ControlProductosWebComponent {
  private authService = inject(AuthService)
  private productoService = inject(ListaProductoWebService)
  private router = inject(Router)
  private activatedRoute = inject(ActivatedRoute)
  public dialog = inject(MatDialog)

  //id del la tabla usuarios_mercadolibre
  id_usuario_ml: number = 0;
  products: any[] = [];
  productsTemp: any[] = [];
  users: Usuario[] = [];
  isLoading = false;
  message: string = '';
  selectedFile?: File;
  dataSource!: MatTableDataSource<Usuario>;
  dataSourceProd!: MatTableDataSource<ProductoWebsTable>;
  dataSourceTemp!: MatTableDataSource<ProductoWebsTable>;

  //checkbox
  selection = new SelectionModel<ProductoWebsTable>(true, []);
  //Producto seleccioando de producto mercado libre 
  selectedRowsUsers: UsuariosmlTable[] = [];
  //Producto seleccioando de producto mercado libre 
  selectedRows: ProductoWebsTable[] = [];
  //Producto seleccionado de productos mercado libre temporales
  selectedRows2: ProductoWebsTable[] = [];
  //Boton Productos mercado libre
  showButton: boolean = false;
  //Boton Productos mercado libre temporal
  showButton2: boolean = false;

  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild("MatProductosProdPaginator") paginatorProd!: MatPaginator;
  @ViewChild("MatProductosTempPaginator") productosTempPaginator!: MatPaginator;
  @ViewChild("MatUsuariosPaginator") UsuariosPaginator!: MatPaginator;

  usersML: string[] = ['checkbox', 'id', 'nombre', 'correo'];
  productsML: string[] = ['checkbox', 'id_producto', 'nombre', 'codigo', 'marca', 'precio2', 'perc30', 'perc', 'notas', 'eliminar', 'imagenes']
  productsMLTemp: string[] = ['checkbox', 'id_producto', 'nombre', 'codigo', 'marca', 'precio2', 'perc30', 'perc', 'notas', 'borrar', 'imagenes']
  public user = computed(() => this.authService.usuarioActual());

  constructor() { }

  ngOnInit(): void {
    if (this.user()?.rol == 1 || this.user()?.rol == 6) {
      this.dataSource = new MatTableDataSource(this.products);
      this.productoService.getUsuariosML().subscribe(resp => {
        this.users = Array.from({ length: resp.usuarios.length }, (_, k) => this.createNewUser(k, resp.usuarios));
        this.dataSource = new MatTableDataSource(this.users);
        this.dataSource.paginator = this.UsuariosPaginator;
      })
    } else if (this.user()?.rol != 3) {
      this.dataSource = new MatTableDataSource(this.products);
      this.productoService.getUsuariosML(this.user()?.usuario).subscribe(resp => {
        this.users = Array.from({ length: resp.usuarios.length }, (_, k) => this.createNewUser(k, resp.usuarios));
        this.dataSource = new MatTableDataSource(this.users);
        this.dataSource.paginator = this.UsuariosPaginator;
      })
    }
  }

  //Cuando el usuario selecciona un empleado entonces se cargar los productos
  selectedUser(id_usuario_ml: number) {

    // this.isLoading = true;
    this.id_usuario_ml = id_usuario_ml;
    this.dataSourceProd = new MatTableDataSource(this.products);
    this.dataSourceTemp = new MatTableDataSource(this.productsTemp);


    this.productoService.getProductosML(this.id_usuario_ml).subscribe(resp => {
      this.products = Array.from({ length: resp.productosml.length }, (_, k) => this.productOfUserById(k, resp.productosml));
      this.dataSourceProd.data = this.products;
      this.dataSourceProd.paginator = this.paginatorProd;
    });


    this.productoService.getProductosmlTemp(this.id_usuario_ml).subscribe(resp => {
      this.productsTemp = Array.from({ length: resp.productosml.length }, (_, k) => this.productOfUserById(k, resp.productosml));
      this.dataSourceTemp.data = this.productsTemp;
      this.dataSourceTemp.paginator = this.productosTempPaginator;
    });
  }

  selectedProduct(id: number) {
    Swal.fire({
      title: '¿Estás seguro de borrar este artículo?',
      text: "¡Este cambio no podrá ser revertido!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.productoService.deleteProduct(id).subscribe(resp => {
          if (resp["ok"] == true) {
            Swal.fire(
              'Borrado!',
              resp["msg"],
              'success'
            );
            this.selectedUser(this.id_usuario_ml);
          } else {
            Swal.fire(
              'Error!',
              resp["errorMsg"],
              'error'
            );
          }
        })
      }
    });
  }

  DeleteAllProducts() {
    Swal.fire({
      title: '¿Estás seguro de borrar todos los artículo a actualizar?',
      text: "¡Este cambio no podrá ser revertido!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.productoService.deleteAllProduct(this.id_usuario_ml).subscribe(resp => {
          if (resp["ok"] == true) {
            Swal.fire(
              'Borrado!',
              resp["msg"],
              'success'
            );
            this.selectedUser(this.id_usuario_ml);
          } else {
            Swal.fire(
              'Error!',
              resp["errorMsg"],
              'error'
            );
          }
        })
      }
    });
  }

  deleteProductTempById(id: number) {
    Swal.fire({
      title: '¿Estás seguro de borrar este artículo?',
      text: "¡Este cambio no podrá ser revertido!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.productoService.deleteProductTempById(id).subscribe(resp => {
          if (resp["ok"] == true) {
            Swal.fire(
              'Borrado!',
              resp["msg"],
              'success'
            );
            this.selectedUser(this.id_usuario_ml);
          } else {
            Swal.fire(
              'Error!',
              resp["errorMsg"],
              'error'
            );
          }
        })
      }
    });
  }

  openDialogoVerFoto(element: ProductoWebsTable) {
    this.dialog.open(DialogoVerImagenComponent, {
      data: {
        productoid: element.id_producto,
        fotosProductos: element.foto_producto,
        tieneFoto: false
      }
    })
  }

  selectUserAgain(): void {
    window.location.reload();
    // // Obtener la ruta actual
    // const currentUrl = this.router.url;

    // console.log(currentUrl);
    // // Navegar a la misma ruta
    // this.router.navigate([currentUrl], { replaceUrl: true });
    // // this.id_usuario_ml = 0;
    // // this.selectedRows = [];
    // // this.selectedRows2 = [];
    // // this.dataSource = new MatTableDataSource(this.users);
    // // this.paginator.ngOnDestroy()
    // // this.productosTempPaginator.ngOnDestroy()
  }


  onUpload() {
    if (this.selectedFile == undefined) {
      Swal.fire('Error', "No ha subido ningún archivo!", 'error')
    } else {
      this.isLoading = true;
      this.message = "Cargando/Actulizando productos. Espere un momento por favor."
      this.productoService.postExcelProductMl(this.id_usuario_ml, this.selectedFile, this.user()?.rol)
        .subscribe(resp => {
          if (resp["ok"] === true) {
            this.selectedUser(this.id_usuario_ml);
            Swal.fire('Todo correcto!!', resp["msg"], 'success')
          }
          else {
            Swal.fire('Error', "Sucedió un error. Notificar a administración", 'error')
          }
          this.isLoading = false;
        })
    }
  }

  onUploadUser() {
    let cadena: string = '';

    if (this.selectedFile == undefined) {
      Swal.fire('Error', "No ha subido ningún archivo!", 'error')
    } else {
        this.selectedRowsUsers.map( resp => {
          cadena =  resp.id + ',' + cadena
        });

        this.isLoading = true;
        this.message = "Cargando/Actulizando productos. Espere un momento por favor."
        this.productoService.postExcelProductMlArray(cadena, this.selectedFile, this.user()?.rol)
          .subscribe( resp => {
            if (resp["ok"] === true) {
            }
            else {
              Swal.fire('Error', "Sucedió un error. Notificar a administración", 'error');
            }
            this.isLoading = false;
          })
    }

  }

  

  executeWithDelay() {
    console.log('Esperando 1 segundo...');
    
    setTimeout(() => {
      console.log('¡1 segundo ha pasado!');
    }, 1000); // 1000 milisegundos = 1 segundo
  }

  searchFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceProd.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceProd.paginator) {
      this.dataSourceProd.paginator.firstPage();
    }
  }

  searchFilter2(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceTemp.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceTemp.paginator) {
      this.dataSourceTemp.paginator.firstPage();
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

  productOfUserById(i: number, products: Productosml[]): any {
    let porcentaje = Number(products[i].precio2) + (Number(products[i].precio2) * 0.3)
    return {
      id: products[i].id,
      id_producto: products[i].id_producto,
      nombre: products[i].producto.nombre,
      codigo: products[i].producto.codigo,
      precio1: products[i].precio1,
      precio2: products[i].precio2,
      precio1_porc: products[i].precio1_porc,
      precio2_porc: products[i].precio2_porc,
      porcentaje30: (parseFloat(porcentaje.toString())).toFixed(4) + '$',
      marca: products[i].producto.marca.nombre,
      foto_producto: products[i].foto_productos
    }
  }

  openDialogNotas(element: ProductoWebsTable) {
    this.dialog.open(DialogoNotaProductoComponent, {
      data: element.id_producto,
    })
  }

  onRowSelectUsers(event: any, row: any) {
    if (event.checked) {
      this.selectedRowsUsers.push(row);
    } else {
      const index = this.selectedRowsUsers.indexOf(row);
      if (index > -1) {
        this.selectedRowsUsers.splice(index, 1);
      }
    }
  }

  onRowSelectProdML(event: any, row: any) {
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

  onRowSelectProdMLTemp(event: any, row: any) {
    if (event.checked) {
      this.selectedRows2.push(row);
    } else {
      const index = this.selectedRows2.indexOf(row);
      if (index > -1) {
        this.selectedRows2.splice(index, 1);
      }
    }
    this.showButton2 = this.selectedRows2.length > 0;
  }

  crearVenta() {
    const usuario_ml_id = this.id_usuario_ml;
    this.dialog.open(DialogoAgregarVentaWebComponent, {
      data: {
        usuario_ml_id,
        items: this.selectedRows
      },
    })
  }

  subirProductoTemp() {
    // console.log(this.selectedRows2);
    Swal.fire({
      title: '¿Estás seguro de montar este artículo?',
      text: "Usted esta realmente consiente que este acto quiere decir que dicho producto que seleccionó\
            ya fue montado o actualizado el precio en MercadoLibre. ¿Aun así quiere continuar?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, quiero continuar'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        // el segundo es el id del usuarios_mercadolibre
        this.productoService.getProductoML(this.id_usuario_ml, this.selectedRows2).subscribe(resp => {
          if (resp["ok"] == true) {
            Swal.fire(
              'Cargado!',
              resp["msg"],
              'success'
            );
            this.selectedRows2 = [];
            this.selectedUser(this.id_usuario_ml);
          } else {
            this.selectedRows2 = [];
            Swal.fire(
              'Error!',
              resp["errorMsg"],
              'error'
            );
          }
        })
      }
      this.isLoading = false;
    })
  }

  openDialogPercent(event: any) {
    this.dialog.open(DialogoPorcentajeComponent, {
      data: event.precio2
    })
  }

  agregarUsuarioMl() {
    this.dialog.open(DialogoAgregarUsuarioMlComponent, {
      data: 2
    })
  }
}
