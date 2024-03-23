import { Component, Inject, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SeccionPedidosService } from '../../services/seccion-pedidos.service';
import { DireccionHablador } from '../../interfaces/response/direccion_hablador_response';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { ReturnStatement } from '@angular/compiler';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-dialogo-crear-hablador-pdf',
  templateUrl: './dialogo-crear-hablador-pdf.component.html',
  styleUrls: ['./dialogo-crear-hablador-pdf.component.css']
})
export class DialogoCrearHabladorPdfComponent implements OnInit {

  private pedidoAlmacenService = inject(SeccionPedidosService);
  private fb = inject(FormBuilder);

  direccionHablador: DireccionHablador[] = [];
  direcciones: string[] = [];
  
  habladorFormulario: FormGroup = this.fb.group({
    direccion: ['', [Validators.maxLength(255)]],
    medio: ['', [Validators.maxLength(255)]],
  });
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: string) {
    this.pedidoAlmacenService.getDireccionHablador(this.data)
    .subscribe(resp => {
      console.log(resp);
      this.direccionHablador = resp.direccionHablador
    })
  }

  ngOnInit() {
  }

  crearPdf(){

    const { direccion, medio} = this.habladorFormulario.value
    let rif: string = '';

    this.direccionHablador.map(resp => {
      if (this.data === resp.hablador_pedido_info.cliente) {
        rif = resp.hablador_pedido_info.riff
      }
    });

    if (!direccion || !medio) return;

    const pdfDefinition: any = {
      content: [
        {
          text: `CLIENTE: ${this.data}`,
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
