import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Error404pageComponent } from './shared/pages/error404page/error404page.component';

const routes: Routes = [
  {
    path:'auth',
    loadChildren: () => import('./auth/auth.module').then(m=>m.AuthModule)
  },
  {
    path: 'rptos',
    loadChildren: () => import('./rptos/rptos.module').then(m=>m.RptosModule)
  },
  {
    path:'404',
    component: Error404pageComponent
  },
  {
    path:'',
    redirectTo:'auth',
    pathMatch:'full'
  },
  {
    path:'**',
    redirectTo:'404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }