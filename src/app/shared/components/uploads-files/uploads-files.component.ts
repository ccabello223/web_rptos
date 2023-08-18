import { Component } from '@angular/core';

@Component({
  selector: 'shared-uploads-files',
  templateUrl: './uploads-files.component.html',
  styleUrls: ['./uploads-files.component.css']
})
export class UploadsFilesComponent {


  selectedFiles: File[] = [];

  onFileSelected(event: any) {
    this.selectedFiles = event.target.files;
  }

  uploadImagenesComprobante() {
    if(this.selectedFiles.length === 0) return;

    const formData = new FormData();
    for (const file of this.selectedFiles) {
      formData.append('images', file, file.name);
    }

    // this.productoService.postFotosComprobante(formData, this.data)
    // .subscribe( resp => {
    //   Swal.fire('Excelente', resp["message"], ( resp["ok"] ) ? 'success' : 'error')
    // });


    this.selectedFiles = [];
  }

  clearSelectedFiles(): void{
    this.selectedFiles = [];
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const dataTransfer = event.dataTransfer;
    if (dataTransfer?.files) {
      this.selectedFiles = Array.from(dataTransfer.files);
    }
  }
}
