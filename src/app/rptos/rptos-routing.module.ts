import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RptosComponent } from './rptos.component';

const routes: Routes = [
  {
    path:'',
    component: RptosComponent,
    children: [
      {
        path:'productos',
        loadChildren: () => import('./productos/productos.module').then(m=>m.ProductosModule)
      },
      {
        path:'**', redirectTo: 'productos',
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RptosRoutingModule { }
