import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Empleado, ProductoWebsTable } from 'src/app/rptos/seccion-productos/interfaces';
import { FormasDePago } from 'src/app/rptos/seccion-productos/interfaces/models/formas_de_pago';
import { TiendasEnWeb } from 'src/app/rptos/seccion-productos/interfaces/models/tiendas_web';
import { ListaProductoWebService } from '../../services/lista-producto-web.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dialogo-agregar-usuario-ml',
  templateUrl: './dialogo-agregar-usuario-ml.component.html',
  styleUrls: ['./dialogo-agregar-usuario-ml.component.css'],
})
export class DialogoAgregarUsuarioMlComponent {

  private productoService = inject(ListaProductoWebService)
  private fb = inject(FormBuilder)
  private dialofRef = inject(MatDialogRef<DialogoAgregarUsuarioMlComponent>)

  usuarioFormulario: FormGroup = this.fb.group({
    correo: ['', [Validators.required, Validators.maxLength(255)]],
    empleado: ['', [Validators.required, Validators.maxLength(255)]],
  });

  empleados:Empleado[] = []
  tiendasWeb:TiendasEnWeb[] = []
  items: ProductoWebsTable[] = [];
  selectedFiles: File[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: number) {
        //this.formGroup = this.createForm();
        this.productoService.getEmpleadosMl().subscribe(resp => {
          this.empleados = resp.Empleados;
        });
        // Crea el FormGroup dinámicamente utilizando el FormBuilder
        //this.formGroup = this.fb2.group({});
      
  }
  
  guardarUsuario():void{
    const body = this.usuarioFormulario.value;

    this.productoService.postUsuarioMl(body)
    .subscribe(resp => {
      if(resp["ok"] === true){

        Swal.fire('Excelente', resp["msg"], 'success')
      }
      else{
        Swal.fire('Error', "Error. hablar con el administrador", 'error')
      }
    })
    this.dialofRef.close()
  }

}
