import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeccionInicioRoutingModule } from './seccion-inicio-routing.module';
import { MaterialModule } from 'src/app/material/material.module';
import { SeccionInicioComponent } from './seccion-inicio.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    SeccionInicioComponent
  ],
  imports: [
    CommonModule,
    SeccionInicioRoutingModule,
    ReactiveFormsModule,
    MaterialModule
  ]
})
export class SeccionInicioModule { }
