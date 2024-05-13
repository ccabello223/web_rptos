import { Component, computed, inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InicioService } from './services/inicio.service';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-seccion-inicio',
  templateUrl: './seccion-inicio.component.html',
  styleUrls: ['./seccion-inicio.component.css']
})
export class SeccionInicioComponent {

  private fb = inject(FormBuilder);
  private inicioService = inject(InicioService);
  private authService = inject(AuthService)
  public user = computed(() => this.authService.usuarioActual());
  
  empleadoFormulario: FormGroup = this.fb.group({
    cedula: ['', [Validators.maxLength(255), Validators.required]],
    nombre: ['', [Validators.maxLength(255), Validators.required]],
    correo: ['', [Validators.maxLength(255), Validators.required]],
    id_rol: ['', [Validators.maxLength(255), Validators.required]],
  });

  public permisos = [
    {nombre: "Tener acceso a solo sus cuentas",value: 4},{nombre: "Acceso a todas las cuentas de mercado libre",value: 6}
  ];

  generarEmpleado():void{ 
    const {correo, cedula} = this.empleadoFormulario.value
    this.inicioService.postEmpleado(this.empleadoFormulario.value)
    .subscribe(resp => {
      if (resp["ok"] === true) {
        Swal.fire('Excelente', `${resp["msg"]} \nUsuario: ${correo}\nContraseña: ${cedula}`, 'success')
      }
      else {
        Swal.fire('Error', `hablar con el administrador.' Error: ${resp["msg"]}`, 'error')
      }
    })
  }
}
