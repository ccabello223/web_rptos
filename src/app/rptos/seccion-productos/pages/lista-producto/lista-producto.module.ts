import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListaProductoRoutingModule } from './lista-producto-routing.module';
import { ListaProductoComponent } from './lista-producto.component';
import { MaterialModule } from 'src/app/material/material.module';
import { DialogoAgregarProductosWebsComponent } from './components/dialogo-agregar-productos-webs/dialogo-agregar-productos-webs.component';
import { DialogoNotaProductoComponent } from './components/dialogo-nota-producto/dialogo-nota-producto.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogoUbicacionesComponent } from './components/dialogo-ubicaciones/dialogo-ubicaciones.component';
import { DialogoVerImagenComponent } from './components/dialogo-ver-imagen/dialogo-ver-imagen.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ListaProductoComponent,
    DialogoAgregarProductosWebsComponent,
    DialogoNotaProductoComponent,
    DialogoUbicacionesComponent,
    DialogoVerImagenComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    ListaProductoRoutingModule,
    SharedModule
  ],
  exports: [
    DialogoNotaProductoComponent,
  ]
})
export class ListaProductoModule { }
