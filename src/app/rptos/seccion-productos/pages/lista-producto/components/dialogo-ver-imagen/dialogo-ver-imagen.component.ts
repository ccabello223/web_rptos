import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialogo-ver-imagen',
  templateUrl: './dialogo-ver-imagen.component.html',
  styles: [
  ]
})
export class DialogoVerImagenComponent {
  images = [
    {
      imageSrc:
        'https://rptoscoreanos.com/Assets/images/uploads/pro_7279_50015c7076adcb77c7568cd6e2067cc9.jpg',
      imageAlt: 'nature1',
    },
    {
      imageSrc:
        'https://rptoscoreanos.com/Assets/images/uploads/pro_4180_168e0244ceaab640d9b54e9922212214.jpg',
      imageAlt: 'nature2',
    },
    {
      imageSrc:
        'https://rptoscoreanos.com/Assets/images/uploads/pro_1219_d22e20255741fe11dee0a8e53ed83a56.jpg',
      imageAlt: 'person1',
    },
    {
      imageSrc:
        'https://rptoscoreanos.com/Assets/images/uploads/pro_191_3c002c84b925cddca65bdadb2d671666.jpg',
      imageAlt: 'person2',
    },
  ]
  constructor(@Inject(MAT_DIALOG_DATA) public data: number) {
    console.log(data);
  }
}

