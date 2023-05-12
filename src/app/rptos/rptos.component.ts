import { Component } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { Usuario } from '../auth/interfaces/interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rptos',
  templateUrl: './rptos.component.html',
  styles: [
  ]
})
export class RptosComponent {
  private _isLogout = false;
  
  public sidebarItems = [
    {label: 'Productos', icon: 'receipt_long', url: 'rptos/productos'},
    {label: 'Cerrar Sesión', icon: 'logout', url: this.onLogout()}
  ]

  get user():Usuario{
    return this.AuthService.usuario;
  }

  constructor(
    private AuthService:AuthService,
    private router: Router){

  }

  onLogout():string{
    if(this._isLogout === true){
      this.AuthService.logout();
    }
    this._isLogout = true;
    return '/auth/login';
  }
}
