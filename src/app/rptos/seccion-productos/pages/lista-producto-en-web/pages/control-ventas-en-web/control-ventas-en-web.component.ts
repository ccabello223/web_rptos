import { Component, ViewChild, computed, inject } from '@angular/core';
import { DialogoNotasVentasComponent } from '../../components/dialogo-notas-ventas/dialogo-notas-ventas.component';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { ProductoService } from 'src/app/rptos/productos/services/producto.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ProductoTablaVentas} from 'src/app/rptos/seccion-productos/interfaces';
import { Venta } from 'src/app/rptos/productos/interface/ventas-web-response';

@Component({
  selector: 'app-control-ventas-en-web',
  templateUrl: './control-ventas-en-web.component.html',
  styleUrls: ['./control-ventas-en-web.component.css']
})
export class ControlVentasEnWebComponent {
  private authService = inject(AuthService)
  public productoService = inject(ProductoService)
  public dialog = inject(MatDialog);

  isLoading = false;
  message: string = '';
  ventas: Venta[] = [];
  displayedColumns: string[] = ['id', 'codigo', 'descripción', 'marca', 'precio1', 'precio2', 'vendedor', 'cliente', 'cantidad', 'fecha', 'notas', 'eliminar'];
  dataSource!: MatTableDataSource<ProductoTablaVentas>;
  public user = computed(() => this.authService.usuarioActual());

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  ngOnInit(): void {
    this.getVentasFromBBDD()
  }

  public getVentasFromBBDD(): void {
    if(this.user()?.rol == 1 || this.user()?.rol == 6 || (this.user()?.rol == 2 && this.user()?.usuario == 30)){
      this.productoService.getVentas().subscribe(resp => {
        this.ventas = resp.ventas
        const users = Array.from({ length: this.ventas.length }, (_, k) => this.createNewVentas(k));
        this.dataSource = new MatTableDataSource(users);
        this.dataSource.paginator = this.paginator;
      })
    }else if(this.user()?.rol != 3){
      this.productoService.getVentas(this.user()?.usuario).subscribe(resp => {
        this.ventas = resp.ventas
        const users = Array.from({ length: this.ventas.length }, (_, k) => this.createNewVentas(k));
        this.dataSource = new MatTableDataSource(users);
        this.dataSource.paginator = this.paginator;
      })
    }
  }

  /** Builds and returns a new Products. */
  createNewVentas(i: number): ProductoTablaVentas {
    return {
      id: this.ventas[i].id,
      codigo: this.ventas[i].producto.codigo,
      descripcion: this.ventas[i].producto.nombre,
      marca: this.ventas[i].producto.marca.nombre,
      precio1: this.ventas[i].producto.precio1,
      precio2: this.ventas[i].producto.precio2,
      vendedor: this.ventas[i].usuarios_mercadolibre.correo,
      cliente: this.ventas[i].nombre_cliente,
      cantidad: this.ventas[i].cantidad_vendida.toString(),
      fecha: this.ventas[i].fecha_venta.toString()
    }
  }

  borrarProducto(id:number){
    Swal.fire({
      title: '¿Estás seguro de borrar esta venta?',
      text: "¡Este cambio no podrá ser revertido!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar'
    }).then((result:any) => {
      if (result.isConfirmed) {
        this.productoService.deleteVenta(id).subscribe(resp => {
          if(resp["ok"] == true){
            Swal.fire(
              'Borrado!',
              resp["msg"],
              'success'
            );
            this.getVentasFromBBDD();
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

  openDialog(element: any) {
    //console.log(element);
    this.dialog.open(DialogoNotasVentasComponent, {
      data: element.id,
    })
  }
}
