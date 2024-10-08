import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListaProductoEnWebRoutingModule } from './lista-producto-en-web-routing.module';
import { ListaProductoEnWebComponent } from './lista-producto-en-web.component';
import { MaterialModule } from 'src/app/material/material.module';
import { ControlProductosWebComponent } from './pages/control-productos-web/control-productos-web.component';
import { ControlVentasEnWebComponent } from './pages/control-ventas-en-web/control-ventas-en-web.component';
import { ListaProductoModule } from '../lista-producto/lista-producto.module';
import { DialogoAgregarVentaWebComponent } from './components/dialogo-agregar-venta-web/dialogo-agregar-venta-web.component';
import { DialogoNotasVentasComponent } from './components/dialogo-notas-ventas/dialogo-notas-ventas.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogoDetalleVentaComponent } from './components/dialogo-detalle-venta/dialogo-detalle-venta.component';
import { SharedModule } from '../../../../shared/shared.module';
import { DialogoPorcentajeComponent } from './components/dialogo-porcentaje/dialogo-porcentaje.component';
import { DialogoAgregarUsuarioMlComponent } from './components/dialogo-agregar-usuario-ml/dialogo-agregar-usuario-ml.component';


@NgModule({
  declarations: [
    ListaProductoEnWebComponent,
    ControlProductosWebComponent,
    ControlVentasEnWebComponent,
    DialogoAgregarVentaWebComponent,
    DialogoNotasVentasComponent,
    DialogoDetalleVentaComponent,
    DialogoPorcentajeComponent,
    DialogoAgregarUsuarioMlComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    ListaProductoEnWebRoutingModule,
    SharedModule
  ],
  exports: [
    DialogoPorcentajeComponent,
  ]
})
export class ListaProductoEnWebModule { }
