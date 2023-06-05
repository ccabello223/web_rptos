import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductoService } from '../../services/producto.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dialogo-notas',
  templateUrl: './dialogo-notas.component.html',
  styleUrls: ['./dialogo-notas.component.css']
})


export class DialogoNotasMlComponent {
  private fb = inject(FormBuilder)
  private productoService = inject(ProductoService)

  notasFormulario: FormGroup = this.fb.group({
    peso: ['', [Validators.maxLength(255)]],
    alto: ['', [Validators.maxLength(255)]],
    ancho: ['', [Validators.maxLength(255)]],
    largo: ['', [Validators.maxLength(255)]],
    precioEstimado: ['', [Validators.maxLength(255)]],
    nota: ['', [Validators.maxLength(255)]]
  });

  items: any = [{name:"Peso",dist:"peso"}, {name:"Alto",dist:"alto"}, {name:"Ancho",dist:"ancho"},
    {name:"Largo",dist:"largo"},{name:"Precio Estimado",dist:"precioEstimado"}, {name:"Nota",dist:"nota"},
  ]

  constructor(@Inject(MAT_DIALOG_DATA) public data: number) {
    this.productoService.getNotasProductoById(data).subscribe(resp => {
      this.notasFormulario.setValue({
        peso: resp.detalles.peso || '',
        alto: resp.detalles.alto || '',
        ancho: resp.detalles.ancho || '',
        largo: resp.detalles.largo || '',
        precioEstimado: resp.detalles.precioEstimado || '',
        nota: resp.detalles.nota || '',
      });
    })
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

