import { Component, Inject, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SeccionPedidosService } from '../../services/seccion-pedidos.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Hablador } from '../../interfaces/models/hablador_pedido_info';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dialogo-crear-info-hablador',
  templateUrl: './dialogo-crear-info-hablador.component.html',
  styleUrls: ['./dialogo-crear-info-hablador.component.css']
})
export class DialogoCrearInfoHabladorComponent implements OnInit {
  
  private pedidoAlmacenService = inject(SeccionPedidosService);
  private dialofRef = inject(MatDialogRef<DialogoCrearInfoHabladorComponent>)
  private fb = inject(FormBuilder);
  
  habladoresInfo: Hablador[] = [];
  
  clienteFormulario: FormGroup = this.fb.group({
    cliente: ['', [Validators.maxLength(255)]],
    rif: ['', [Validators.maxLength(255)]],
  });

  direccionFormulario: FormGroup = this.fb.group({
    id_hablador_pedido: ['', [Validators.maxLength(255)]],
    direccion: ['', [Validators.maxLength(255)]],
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: string) {
    this.pedidoAlmacenService.getHabladorInfo()
    .subscribe(resp => {
      this.habladoresInfo = resp.habladores;
    })
  }

  ngOnInit() {
  }

  insertarInfoParaHablador(){
    let { cliente, rif } = this.clienteFormulario.value
    cliente = cliente.toUpperCase()
    rif = 'J-' + rif;
    let body = {cliente, rif} 
    this.pedidoAlmacenService.postHabladorInfo(body).
    subscribe( resp => {
      if (resp["ok"] === true) {
        Swal.fire('Excelente', resp["msg"], 'success')
      }else{
        Swal.fire('Error', resp["msg"], 'error')
      }
    })
    this.dialofRef.close()
  }

  insertarInfoParaDireccion(){
    let { id_hablador_pedido, direccion } = this.direccionFormulario.value
    direccion = direccion.toUpperCase()
    let body = {id_hablador_pedido, direccion} 
    this.pedidoAlmacenService.postDireccionHablador(body).
    subscribe( resp => {
      if (resp["ok"] === true) {
        Swal.fire('Excelente', resp["msg"], 'success')
      }else{
        Swal.fire('Error', resp["msg"], 'error')
      }
    })
    this.dialofRef.close()
  }

}
