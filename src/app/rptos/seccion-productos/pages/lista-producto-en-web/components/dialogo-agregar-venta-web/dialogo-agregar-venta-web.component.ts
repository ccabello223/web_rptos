import { Component, Inject, OnInit, QueryList, ViewChildren, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductoService } from 'src/app/rptos/productos/services/producto.service';
import { Productosml } from 'src/app/rptos/seccion-productos/interfaces/producto-webs-response';
import Swal from 'sweetalert2';
import { ListaProductoService } from '../../../lista-producto/services/lista-producto.service';
import { ListaProductoWebService } from '../../services/lista-producto-web.service';
import { FormasDePago } from 'src/app/rptos/seccion-productos/interfaces/models/formas_de_pago';
import { TiendasEnWeb } from 'src/app/rptos/seccion-productos/interfaces/models/tiendas_web';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductoWebsTable } from 'src/app/rptos/seccion-productos/interfaces';

interface FormControls {
  [key: string]: FormControl;
}

@Component({
  selector: 'app-dialogo-agregar-venta-web',
  templateUrl: './dialogo-agregar-venta-web.component.html',
  styleUrls: ['./dialogo-agregar-venta-web.component.css']
})
export class DialogoAgregarVentaWebComponent{
  private productoService = inject(ListaProductoWebService)
  private fb = inject(FormBuilder)
  private fb2 = inject(FormBuilder)
  
  
  pagoSeleccionado: string = '';
  usuario_ml_id: number;
  tiendaSeleccionada: string = '';
  nombreProducto: string = '';
  formasDePago:FormasDePago[] = []
  tiendasWeb:TiendasEnWeb[] = []
  items: ProductoWebsTable[] = [];
  
  notasFormulario: FormGroup = this.fb.group({
    pago: ['', [Validators.required, Validators.maxLength(255)]],
    tienda: ['', [Validators.required, Validators.maxLength(255)]],
    nombre_cliente: ['', [Validators.required, Validators.maxLength(255)]],
  });

  //formGroup: FormGroup;
  

  constructor(@Inject(MAT_DIALOG_DATA) public data: { usuario_ml_id: number; items: ProductoWebsTable[] }) {
    this.items = data.items;
    this.usuario_ml_id = data.usuario_ml_id;
    //this.formGroup = this.createForm();
    this.productoService.getFormaDePagos().subscribe(resp => {
        this.formasDePago = resp;
      });
      this.productoService.getRedesSociales().subscribe(resp => {
        this.tiendasWeb = resp;
      });

      // Crea el FormGroup dinámicamente utilizando el FormBuilder
      //this.formGroup = this.fb2.group({});
      
      // Agrega los mat-form-fields al FormGroup según el arreglo de items
      for (let index = 0; index < this.items.length; index++) {
        this.notasFormulario.addControl(`cantidad${index}`, this.fb.control('', [Validators.required, Validators.maxLength(255)])); 
      }
  }

  guardarNota(): void {
    let itemsArrglo: any[] = [];
    const { pago, tienda, nombre_cliente } = this.notasFormulario.value;
    for (let index = 0; index < this.items.length; index++) {
      const producto = {
        producto_id: this.items[index].id_producto,
        cantidad: this.notasFormulario.value[`cantidad${index}`],
      }
      itemsArrglo.push(producto)
    }
    const body = {
      usuario_ml_id: this.usuario_ml_id,
      items: itemsArrglo,
      nombre_cliente,
      pago,
      tienda
    }

    this.productoService.postVentas(body)
    .subscribe(resp => {
      if(resp["ok"] === true){
        Swal.fire('Excelente', resp["msg"], 'success')
      }
      else{
        Swal.fire('Error', "Error. hablar con el administrador", 'error')
      }
    })
  }

}
