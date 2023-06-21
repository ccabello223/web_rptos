import { Component, ViewChild, inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ProductoTablaVentas } from '../../interface/producto-tabla-ventas';
import { DialogoNotasMlComponent } from '../dialogo-notas/dialogo-notas.component';
import { MatDialog } from '@angular/material/dialog';
import { ProductoService } from '../../services/producto.service';
import { Venta } from '../../interface/ventas-web-response';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-ventas-web',
  templateUrl: './ventas-web.component.html',
  styleUrls: ['./ventas-web.component.css']
})
export class VentasWebComponent {

  public productoService = inject(ProductoService)

  isLoading = false;
  message: string = '';
  ventas: Venta[] = [];
  displayedColumns: string[] = ['id', 'codigo', 'descripción', 'marca', 'precio1', 'precio2', 'vendedor', 'cantidad', 'fecha'];
  dataSource!: MatTableDataSource<ProductoTablaVentas>;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  ngOnInit(): void {
    this.getVentasFromBBDD()
  }

  getVentasFromBBDD() {
    this.productoService.getVentas().subscribe(resp => {
      this.ventas = resp.ventas
      const users = Array.from({ length: this.ventas.length }, (_, k) => this.createNewVentas(k));
      this.dataSource = new MatTableDataSource(users);
      this.dataSource.paginator = this.paginator;
    })
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
      cantidad: this.ventas[i].cantidad_vendida.toString(),
      fecha: this.ventas[i].fecha_venta.toString()
    }
  }
}
