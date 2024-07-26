import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ListaProductoWebService } from '../../../lista-producto-en-web/services/lista-producto-web.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dialogo-editar-producto',
  templateUrl: './dialogo-editar-producto.component.html',
  styleUrls: ['./dialogo-editar-producto.component.css'],
})
export class DialogoEditarProductoComponent {

  private fb = inject(FormBuilder)
  private productoService = inject(ListaProductoWebService)

  marca: string = ''

  ProductoFormulario: FormGroup = this.fb.group({
    codigo: ['', [Validators.maxLength(255)]],
    descrip: ['', [Validators.maxLength(255)]],
    marca: ['', [Validators.maxLength(255)]],
    precio: ['', [Validators.maxLength(255)]],
  });

  items: any = [{name:"Codigo",dist:"codigo"}, {name:"Descripción",dist:"descrip"}, {name:"Marca",dist:"marca"},
    {name:"Precio",dist:"precio"}
  ]

  constructor(@Inject(MAT_DIALOG_DATA) public data: number) {
    this.productoService.getProductoById(data).subscribe(resp => {
      this.marca = resp.productos[0].marca.nombre
      this.ProductoFormulario.setValue({
        codigo: resp.productos[0].codigo || '',
        descrip: resp.productos[0].nombre || '',
        marca: resp.productos[0].marca.nombre || '',
        precio: resp.productos[0].precio2 || '',
      });
    })
  }

  guardarNota(): void {

    let { codigo, descrip, marca, precio } = this.ProductoFormulario.value;
    if (this.marca === marca){
      marca = ''
    }
    const body = {codigo, descrip, marca, precio}
    this.productoService.putProductoById(this.data, body)
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