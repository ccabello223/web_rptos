import { Component, ElementRef, Inject, ViewChild, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { ListaProductoService } from '../../services/lista-producto.service';
import { Ubicacion } from 'src/app/rptos/seccion-productos/interfaces/models/ubicaciones';

@Component({
  selector: 'app-dialogo-ubicaciones',
  templateUrl: './dialogo-ubicaciones.component.html',
  styles: [
  ]
})
export class DialogoUbicacionesComponent {
  private productoService = inject(ListaProductoService)

  @ViewChild('txtTagInput')
  public tagInput!: ElementRef<HTMLInputElement>;

  public ubicaciones: Ubicacion[] = [];
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: { productoid: number; distid: string }) {
    this.searchUbicacion();
  }

  private searchUbicacion():void{
    this.productoService.getUbicaciones(this.data.productoid, this.data.distid)
    .subscribe( resp => {
      this.ubicaciones = resp.ubicaciones
    })
  }

  borrarUbicacion(productoid:number):void{
    Swal.fire({
      title: '¿Estás seguro de borrar esta ubicación?',
      text: "¡Este cambio no podrá ser revertido!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, borrar'
    }).then((result:any) => {
      if (result.isConfirmed) {
        this.productoService.deleteUbicacion(productoid).subscribe(resp => {
          if(resp["ok"] == true){
            Swal.fire('Borrado!', resp["msg"], 'success');
            this.searchUbicacion();
          }else{
            Swal.fire('Error!',resp["errorMsg"],'error');
          }
        })
      }
    })
  }

  valueOfInput(): void{
    const ubicacion = this.tagInput.nativeElement.value
    const body = { productoid: this.data.productoid, distid: this.data.distid, ubicacion }
    this.productoService.postUbicaciones(body)
    .subscribe( resp => {
      if(resp["ok"] === true){
        Swal.fire('Excelente', resp["msg"], 'success');
        this.searchUbicacion();
      }
      else{
        Swal.fire('Error', "Error. hablar con el administrador", 'error');
      }
    })
  }
}
