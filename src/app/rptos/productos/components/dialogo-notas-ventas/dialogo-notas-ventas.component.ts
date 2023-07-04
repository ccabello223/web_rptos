import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductoService } from '../../services/producto.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dialogo-notas-ventas',
  templateUrl: './dialogo-notas-ventas.component.html',
  styleUrls: ['./dialogo-notas-ventas.component.css']
})
export class DialogoNotasVentasComponent {
  private fb = inject(FormBuilder)
  private productoService = inject(ProductoService)

  notasFormulario: FormGroup = this.fb.group({
    nota2: ['', [Validators.maxLength(255)]],
    nota3: ['', [Validators.maxLength(255)]],
  });

  items: any = [{name:"Nota",dist:"nota2"}, {name:"Nota 2",dist:"nota3"}]

  constructor(@Inject(MAT_DIALOG_DATA) public data: number) {
    this.productoService.getNotasVentasWebById(data).subscribe(resp => {
      this.notasFormulario.setValue({
        nota2: resp.detalles.nota2 || '',
        nota3: resp.detalles.nota3 || '',
      });
    })
  }

  guardarNota(): void {
    const id_producto = this.data
    const { nota2, nota3 } = this.notasFormulario.value;
    const body = {id_producto, nota2, nota3 }
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
