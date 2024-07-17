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

  notasFormulario: FormGroup = this.fb.group({
    peso: ['', [Validators.maxLength(255)]],
    alto: ['', [Validators.maxLength(255)]],
    ancho: ['', [Validators.maxLength(255)]],
    largo: ['', [Validators.maxLength(255)]],
    precioEstimado: ['', [Validators.maxLength(255)]],
    nota: ['', [Validators.maxLength(255)]]
  });

  items: any = [{name:"Codigo",dist:"codigo"}, {name:"Descripción",dist:"descrip"}, {name:"Marca",dist:"marca"},
    {name:"Precio",dist:"precio"}
  ]

  constructor(@Inject(MAT_DIALOG_DATA) public data: number) {
    // this.productoService.getNotasProductoById(data).subscribe(resp => {
    //   this.notasFormulario.setValue({
    //     codigo: resp.detalles.peso || '',
    //     descrip: resp.detalles.alto || '',
    //     marca: resp.detalles.ancho || '',
    //     precio: resp.detalles.largo || '',
    //   });
    // })
  }

  guardarNota(): void {
    const id_producto = this.data
    const { peso, alto, ancho, largo, precioEstimado, nota } = this.notasFormulario.value;
    const body = {id_producto, peso, alto, ancho, largo, precioEstimado, nota}
    this.productoService.postNotasProducto(body)
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