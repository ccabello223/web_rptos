import { Component, Inject, QueryList, ViewChild, ViewChildren, computed, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { MatSelectionList } from '@angular/material/list';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ProductoService } from 'src/app/rptos/productos/services/producto.service';
import { ProductoTabla, Usuario } from 'src/app/rptos/seccion-productos/interfaces';
import Swal from 'sweetalert2';

interface ProductosEnVentasWeb {
  id_producto: number;
  precio1: string;
  precio2: string;
  id_usuario_ml: number;
}

@Component({
  selector: 'app-dialogo-agregar-productos-webs',
  templateUrl: './dialogo-agregar-productos-webs.component.html',
  styleUrls: ['./dialogo-agregar-productos-webs.component.css']
})
export class DialogoAgregarProductosWebsComponent {
  private fb = inject(FormBuilder)
  private productoService = inject(ProductoService)
  private authService = inject(AuthService)
  public user = computed(() => this.authService.usuarioActual());


  productosAlaBBDD: ProductosEnVentasWeb[] = [];
  usuariosML: Usuario[] = []
  id_usuario_ml: number = 0;
  escogioUsuario: boolean = false;

  @ViewChildren(MatFormField) formFields?: QueryList<MatFormField>;
  @ViewChild('selectionList') selectionList?: MatSelectionList;

  constructor(@Inject(MAT_DIALOG_DATA) public data: ProductoTabla[]) {
    if (this.user()?.rol == 1 || this.user()?.rol == 6) {
      this.productoService.getUsuariosML().subscribe(resp => {
        this.usuariosML = resp.usuarios;
      })
    } else if (this.user()?.rol != 3) {
      this.productoService.getUsuariosML(this.user()?.usuario).subscribe(resp => {
        this.usuariosML = resp.usuarios;
      })
    }
  }

  onSelectionChange(event: any) {
    const selectedOption = this.selectionList?.selectedOptions.selected[0];
    this.id_usuario_ml = selectedOption?.value;
    this.productosAlaBBDD = []
    this.escogioUsuario = true;
  }

  onSubmit() {
    let esCampoVacio: boolean = false
    this.formFields?.forEach((formField: any) => {
      if (formField._control.value.length == 0) {
        Swal.fire('Error', "Tiene que colocar el precio a todos los productos", 'error')
        esCampoVacio = true;
      }
      return;
    });
    if (!esCampoVacio) {
      this.formFields?.forEach((formField: any) => {
        this.productosAlaBBDD.push(this.productOfUserById(formField));
      });

      this.productoService.postDesdeListaProducto(this.productosAlaBBDD).subscribe(resp => {
        if (resp["ok"] === true) {
          this.productosAlaBBDD = [];
          Swal.fire('Excelente', resp["msg"], 'success')
        }
        else {
          this.productosAlaBBDD = [];
          Swal.fire('Error', "Error. hablar con el administrador", 'error')
        }
      })
    }
  }

  productOfUserById(value: any): ProductosEnVentasWeb {
    let cargar: ProductosEnVentasWeb;
    this.data.forEach(element => {
      if (element.codigo == value._control.name) {
        cargar = {
          id_producto: element.id,
          precio1: '0.00',
          precio2: value._control.value,
          id_usuario_ml: this.id_usuario_ml
        }
      }
    });
    return cargar!;
  }
}
