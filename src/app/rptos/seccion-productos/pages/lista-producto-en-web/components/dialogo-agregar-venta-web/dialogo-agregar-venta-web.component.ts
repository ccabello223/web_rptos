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
  tiendaSeleccionada: string = '';
  formasDePago:FormasDePago[] = []
  tiendasWeb:TiendasEnWeb[] = []
  items: Productosml[] = [];
  
  notasFormulario: FormGroup = this.fb.group({
    pago: ['', [Validators.maxLength(255)]],
    tienda: ['', [Validators.maxLength(255)]],
    nombre_cliente: ['', [Validators.maxLength(255)]],
  });

  formControls: FormControls = {};
  formGroup: FormGroup;
  

  constructor(@Inject(MAT_DIALOG_DATA) public data: { usuario_ml_id: number; items: Productosml[] }) {
    this.items = data.items;
    this.formGroup = this.createForm();
    this.productoService.getFormaDePagos().subscribe(resp => {
        this.formasDePago = resp;
      });
      this.productoService.getRedesSociales().subscribe(resp => {
        this.tiendasWeb = resp;
      });
  }

  guardarNota(): void {
    // const id_producto = this.data
    const { pago, tienda, nombre_cliente } = this.notasFormulario.value;
    console.log(this.notasFormulario.value);


    // const body = {id_producto, peso, alto, ancho, largo, precioEstimado, nota}
    // this.productoService.postNotasProducto(body)
    // .subscribe(resp => {
    //   if(resp["ok"] === true){
    //     Swal.fire('Excelente', resp["msg"], 'success')
    //   }
    //   else{
    //     Swal.fire('Error', "Error. hablar con el administrador", 'error')
    //   }
    // })
  }

  createForm():FormGroup {
    console.log(this.items);
    // Agregar un control para cada elemento en el arreglo
    this.items.forEach(item => {
      this.formControls[item.producto.codigo] = new FormControl('', [Validators.maxLength(255)]);   
    });

    return this.fb2.group(this.formControls);
  }
}
