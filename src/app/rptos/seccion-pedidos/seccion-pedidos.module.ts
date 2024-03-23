import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeccionPedidosRoutingModule } from './seccion-pedidos-routing.module';
import { SeccionPedidosComponent } from './seccion-pedidos.component';
import { MaterialModule } from 'src/app/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AgregarPedidoPageComponent } from './pages/agregar-pedido-page/agregar-pedido-page.component';
import { SharedModule } from '../../shared/shared.module';
import { DialogoMostrarFotoComponent } from './components/dialogo-mostrar-foto/dialogo-mostrar-foto.component';
import { DialogoCrearHabladorPdfComponent } from './components/dialogo-crear-hablador-pdf/dialogo-crear-hablador-pdf.component';
import { DialogoCrearInfoHabladorComponent } from './components/dialogo-crear-info-hablador/dialogo-crear-info-hablador.component';


@NgModule({
  declarations: [
    SeccionPedidosComponent,
    AgregarPedidoPageComponent,
    DialogoMostrarFotoComponent,
    DialogoCrearHabladorPdfComponent,
    DialogoCrearInfoHabladorComponent
  ],
  imports: [
    CommonModule,
    SeccionPedidosRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule
  ]
})
export class SeccionPedidosModule { }
