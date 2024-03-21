import { Component, ViewChild, inject } from '@angular/core';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SeccionPedidosService } from './services/seccion-pedidos.service';
import { PedidoAlmacen } from './interfaces/models/pedido_almacen';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DialogoMostrarFotoComponent } from './components/dialogo-mostrar-foto/dialogo-mostrar-foto.component';
import { MatPaginator } from '@angular/material/paginator';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Hablador } from './interfaces/models/hablador_pedido_info';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-seccion-pedidos',
  templateUrl: './seccion-pedidos.component.html',
  styleUrls: ['./seccion-pedidos.component.css']
})
export class SeccionPedidosComponent {
  private fb = inject(FormBuilder);
  private pedidoAlmacenService = inject(SeccionPedidosService);
  private dialog = inject(MatDialog)

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  selectedFiles: File[] = [];
  habladoresInfo: Hablador[] = [];
  isLoading = false;

  pedidoFormulario: FormGroup = this.fb.group({
    nombre: ['', [Validators.maxLength(255)]],
    pedido: ['', [Validators.maxLength(255)]],
    descripcion: ['', [Validators.maxLength(255)]],
  });

  habladorFormulario: FormGroup = this.fb.group({
    nombre: ['', [Validators.maxLength(255)]],
    rif: ['', [Validators.maxLength(255)]],
    direccion: ['', [Validators.maxLength(255)]],
    medio: ['', [Validators.maxLength(255)]],
  });

  items: any = [{ name: "Nombre", dist: "nombre" }, { name: "Numero Pedido", dist: "pedido" }, { name: "Descripción", dist: "descripcion" },
  ]

  habladorItems: any = [{ name: "Nombre", dist: "nombre" }, { name: "RIF", dist: "rif" }, { name: "Dirección", dist: "direccion" }, { name: "¿Se va por?", dist: "medio" },
  ]

  // Otra pagina la tabla
  pedidosAlmacen: PedidoAlmacen[] = [];

  dataSource!: MatTableDataSource<PedidoAlmacen>;
  displayedColumns: string[] = ['id', 'nombre', 'pedido', 'descripcion', 'imagen'];
  clickedRows = new Set<PedidoAlmacen>();


  /** Builds and returns a new Products. */
  createNewProducts(i: number): PedidoAlmacen {
    return {
      id: this.pedidosAlmacen[i].id,
      nombre: this.pedidosAlmacen[i].nombre,
      pedido: this.pedidosAlmacen[i].pedido,
      descripcion: this.pedidosAlmacen[i].descripcion,
      fecha_creacion: this.pedidosAlmacen[i].fecha_creacion
    }
  }

  openDialog(element: PedidoAlmacen): void{
    this.dialog.open(DialogoMostrarFotoComponent, {
      data: element.id,
    })
  }

  constructor() {
    this.pedidoFormulario.setValue({
      nombre: '',
      pedido: '',
      descripcion: '',
    });
    this.pedirDataPedidoAlmacen();
    this.pedirClientesParaHabladores()
  }

  private pedirDataPedidoAlmacen(){
    this.pedidoAlmacenService.getPedidoAlmacen()
    .subscribe(resp => {
      this.pedidosAlmacen = resp;
      const pedido = Array.from({ length: this.pedidosAlmacen.length }, (_, k) => this.createNewProducts(k));
      this.dataSource = new MatTableDataSource(pedido);
      this.dataSource.paginator = this.paginator;
    });
  }

  private pedirClientesParaHabladores(){
    this.pedidoAlmacenService.getHabladorInfo()
      .subscribe(resp => {
        this.habladoresInfo = resp.habladores;
      })
  }

  guardarNota(): void {
    if (this.selectedFiles.length === 0) return;

    this.isLoading = true;

    const formData = new FormData();
    for (const file of this.selectedFiles) {
      formData.append('images', file, file.name);
    }
    formData.append('nombre', this.pedidoFormulario.value.nombre);
    formData.append('pedido', this.pedidoFormulario.value.pedido);
    formData.append('descripcion', this.pedidoFormulario.value.descripcion);

    this.pedidoAlmacenService.postPedidoAlmacen(formData)
      .subscribe(resp => {
        if (resp["ok"] === true) {
          Swal.fire('Excelente', resp["msg"], 'success')
          this.selectedFiles = [];
          this.pedidoFormulario.reset();
          this.pedirDataPedidoAlmacen();
          this.isLoading = false;
        }
        else {
          Swal.fire('Error', `hablar con el administrador.' Error: ${resp["msg"]}`, 'error')
          this.isLoading = false;
        }
      });
  }

  onFileSelected(event: any) {
    this.selectedFiles = event.target.files;
  }

  // uploadImagenesComprobante() {
  //   if (this.selectedFiles.length === 0) return;

  //   const formData = new FormData();
  //   for (const file of this.selectedFiles) {
  //     formData.append('images', file, file.name);
  //   }

  //   this.selectedFiles = [];
  // }

  clearSelectedFiles(): void {
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

  createPdf(){

    const { nombre,  rif, direccion, medio} = this.habladorFormulario.value

    const pdfDefinition: any = {
      content: [
        {
          text: `CLIENTE: ${nombre}`,
          style: 'header',
          alignment: 'center'
        },
        {
          text: `DIRECCION: ${direccion}`,
          style: 'header',
          alignment: 'center'
        },
        {
          text: `RIF: ${rif}`,
          style: 'header',
          alignment: 'center'
        },
        {
          text: medio,
          style: 'header',
          alignment: 'center'
        },
      ],
      styles: {
        header: {
          fontSize: 30,
          bold: true,
          alignment: 'justify'
        }
      }
    }

    const pdf = pdfMake.createPdf(pdfDefinition);
    pdf.download();

  }
}