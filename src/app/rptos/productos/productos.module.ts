import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { ProductosRoutingModule } from './productos-routing.module';
import { MaterialModule } from 'src/app/material/material.module';
import { ListaMercadolibreComponent } from './components/lista-mercadolibre/lista-mercadolibre.component';



@NgModule({
  declarations: [
    LayoutPageComponent,
    ListaMercadolibreComponent
  ],
  imports: [
    CommonModule,
    ProductosRoutingModule,
    MaterialModule
  ]
})
export class ProductosModule { }
