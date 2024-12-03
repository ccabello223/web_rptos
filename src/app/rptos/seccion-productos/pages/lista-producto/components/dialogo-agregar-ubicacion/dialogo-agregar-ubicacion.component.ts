import { Component, inject, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ListaProductoWebService } from '../../../lista-producto-en-web/services/lista-producto-web.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Almacenistum } from 'src/app/rptos/seccion-productos/interfaces/models/almacenista';
import { ListaProductoService } from '../../services/lista-producto.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dialogo-agregar-ubicacion',
  templateUrl: './dialogo-agregar-ubicacion.component.html',
  styleUrls: ['./dialogo-agregar-ubicacion.component.css']
})
export class DialogoAgregarUbicacionComponent implements OnInit {

  private productoService = inject(ListaProductoService)
  private fb = inject(FormBuilder)
  private dialofRef = inject(MatDialogRef<DialogoAgregarUbicacionComponent>)
  
  almacenistas:Almacenistum[] = []
  
  ubicacionFormulario: FormGroup = this.fb.group({
    ubicacion: ['', [Validators.required, Validators.maxLength(255)]],
    cantidad: ['', [Validators.required, Validators.maxLength(255)]],
    almacenista: ['', [Validators.required, Validators.maxLength(255)]],
  });

  //formGroup: FormGroup;
  

  constructor(@Inject(MAT_DIALOG_DATA) public data: { productoid: number, distid: string }) {

    this.productoService.getAlmacenistas().subscribe(resp => {
        this.almacenistas = resp;
      });
      
  }
  ngOnInit(): void {

  }

  guardarUbicacion(): void {
    const {ubicacion, cantidad, almacenista} = this.ubicacionFormulario.value;

    const body = {
      ubicacion,
      cantidad,
      almacenista,
      productoid: this.data.productoid,
      distid: this.data.distid  
    }
    
    this.productoService.postUbicaciones(body)
    .subscribe( resp => {
      if(resp["ok"] === true){
        Swal.fire('Excelente', resp["msg"], 'success');
        this.dialofRef.close(true)
      }
      else{
        Swal.fire('Error', "Error. hablar con el administrador", 'error');
        this.dialofRef.close(false)
      }
    })
  }

}
