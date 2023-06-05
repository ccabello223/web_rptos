import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { ProductosRoutingModule } from './productos-routing.module';
import { MaterialModule } from 'src/app/material/material.module';
import { ListaMercadolibreComponent } from './components/lista-mercadolibre/lista-mercadolibre.component';
import { DialogoNotasMlComponent } from './components/dialogo-notas-ml/dialogo-notas-ml.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    LayoutPageComponent,
    ListaMercadolibreComponent,
    DialogoNotasMlComponent
  ],
  
  imports: [
    CommonModule,
    ProductosRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class ProductosModule { }
