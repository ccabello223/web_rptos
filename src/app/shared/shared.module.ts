import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Error404pageComponent } from './pages/error404page/error404page.component';
import { UploadsFilesComponent } from './components/uploads-files/uploads-files.component';



@NgModule({
  declarations: [
    Error404pageComponent,
    UploadsFilesComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    UploadsFilesComponent
  ]
})
export class SharedModule { }
