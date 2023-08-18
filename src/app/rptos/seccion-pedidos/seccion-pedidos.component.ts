import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { ListaProductoWebService } from '../seccion-productos/pages/lista-producto-en-web/services/lista-producto-web.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SeccionPedidosService } from './services/seccion-pedidos.service';

@Component({
  selector: 'app-seccion-pedidos',
  templateUrl: './seccion-pedidos.component.html',
  styleUrls: ['./seccion-pedidos.component.css']
})
export class SeccionPedidosComponent {
  private fb = inject(FormBuilder)
  private pedidoAlmacenService = inject(SeccionPedidosService)

  selectedFiles: File[] = [];

  pedidoFormulario: FormGroup = this.fb.group({
    nombre: ['', [Validators.maxLength(255)]],
    pedido: ['', [Validators.maxLength(255)]],
    descripcion: ['', [Validators.maxLength(255)]],
  });

  items: any = [{name:"Nombre",dist:"nombre"}, {name:"Numero Pedido",dist:"pedido"}, {name:"Descripción",dist:"descripcion"},
  ]

  constructor() {
      this.pedidoFormulario.setValue({
        nombre: '',
        pedido:  '',
        descripcion:  '',
      });
  }

  guardarNota(): void {
    if(this.selectedFiles.length === 0) return;

    const formData = new FormData();
    for (const file of this.selectedFiles) {
      formData.append('images', file, file.name);
    }
    formData.append('nombre', this.pedidoFormulario.value.nombre);
    formData.append('pedido', this.pedidoFormulario.value.pedido);
    formData.append('descripcion', this.pedidoFormulario.value.descripcion);
    
    this.pedidoAlmacenService.postPedidoAlmacen(formData)
    .subscribe(resp => {
      if(resp["ok"] === true){
        Swal.fire('Excelente', resp["msg"], 'success')
        this.selectedFiles = [];
        this.pedidoFormulario.reset()
      }
      else{
        Swal.fire('Error', "Error. hablar con el administrador", 'error')
      }
    })
  }

  onFileSelected(event: any) {
    this.selectedFiles = event.target.files;
  }

  uploadImagenesComprobante() {
    if(this.selectedFiles.length === 0) return;

    const formData = new FormData();
    for (const file of this.selectedFiles) {
      formData.append('images', file, file.name);
    }


    this.selectedFiles = [];
  }

  clearSelectedFiles(): void{
    this.selectedFiles = [];
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const dataTransfer = event.dataTransfer;
    if (dataTransfer?.files) {
      this.selectedFiles = Array.from(dataTransfer.files);
    }
  }

  /*----------------------*/
  
  ELEMENT_DATA: PeriodicElement[] = [
    {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
    {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
    {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
    {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
    {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
    {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
    {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
    {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
    {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
    {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  ];
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'notas'];
  dataSource = this.ELEMENT_DATA;
  clickedRows = new Set<PeriodicElement>();

  openDialog(element: any): void{
    console.log(element);
  }
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}