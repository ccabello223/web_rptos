import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, MaxLengthValidator, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Detalles } from '../../interface/notas-response';
import { ProductoService } from '../../services/producto.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dialogo-notas-ml',
  templateUrl: './dialogo-notas-ml.component.html',
  styleUrls: ['./dialogo-notas-ml.component.css']
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

  constructor(@Inject(MAT_DIALOG_DATA) public data: Detalles) {
    // Hacer la peticion aqui
    this.notasFormulario.setValue({
      peso: data.peso || '',
      alto: data.alto || '',
      ancho: data.ancho || '',
      largo: data.largo || '',
      precioEstimado: data.precioEstimado || '',
      nota: data.nota || '',
    });
  }

  guardarNota(): void {
    const id_producto_ml = this.data.id_producto_ml;
    const id_usuario_ml = this.data.id_usuario_ml;
    const { peso, alto, ancho, largo, precioEstimado, nota } = this.notasFormulario.value;
    const body = {id_producto_ml, peso, alto, ancho, largo, precioEstimado, nota, id_usuario_ml}
    console.log(id_producto_ml);
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

