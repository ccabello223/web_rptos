import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Error404pageComponent } from './pages/error404page/error404page.component';
import { UploadsFilesComponent } from './components/uploads-files/uploads-files.component';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    Error404pageComponent,
    UploadsFilesComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule  
  ],
  exports: [
    UploadsFilesComponent
  ]
})
export class SharedModule { }
