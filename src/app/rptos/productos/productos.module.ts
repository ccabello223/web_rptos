import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { ProductosRoutingModule } from './productos-routing.module';
import { MaterialModule } from 'src/app/material/material.module';
import { ListaMercadolibreComponent } from './components/lista-mercadolibre/lista-mercadolibre.component';
import { DialogoNotasMlComponent } from './components/dialogo-notas/dialogo-notas.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ListaProductosComponent } from './components/lista-productos/lista-productos.component';
import { VentasWebComponent } from './components/ventas-web/ventas-web.component';
import { DialogoNotasVentasComponent } from './components/dialogo-notas-ventas/dialogo-notas-ventas.component';
import { DialogoAgregarVentaComponent } from './components/dialogo-agregar-venta/dialogo-agregar-venta.component';
import { DialogoAgregarProductosWebsComponent } from './components/dialogo-agregar-productos-webs/dialogo-agregar-productos-webs.component';



@NgModule({
  declarations: [
    LayoutPageComponent,
    ListaMercadolibreComponent,
    DialogoNotasMlComponent,
    ListaProductosComponent,
    VentasWebComponent,
    DialogoNotasVentasComponent,
    DialogoAgregarVentaComponent,
    DialogoAgregarProductosWebsComponent,
  ],
  
  imports: [
    CommonModule,
    ProductosRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  exports:[
    DialogoNotasMlComponent,
  ]
})
export class ProductosModule { }
