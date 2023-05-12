import { Injectable } from '@angular/core';
import { AuthResponse, Usuario } from '../interfaces/interfaces';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environments';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl: string = environment.baseUrl;
  private _usuario!: Usuario;

  get usuario(){
    return {...this._usuario};
  }

  constructor(private http: HttpClient) { }

  login(email_user: string, password: string){
    const url = `${this.baseUrl}/auth`;
    const body = {email_user, password} 
    return this.http.post<AuthResponse>(url, body)
    .pipe(
      tap(resp => {
        if(resp.ok){
          this._usuario = {
            email_user: resp.email_user!,
            rol: resp.rol!,
            distid: resp.distid!
          }
          localStorage.setItem('token', resp.token?.toString() || '')
        }
      }),
      map(resp=> resp.ok),
      catchError(err => of(err.error.msg))
    );
  }

  checkAuthentication(): Observable<boolean>{
    if(!localStorage.getItem('token')) return of(false);
    return of(true);
  }

  logout(){
    this._usuario = {
      email_user: '',
      rol: 0,
      distid: ''
    };
    localStorage.clear();
  }
}
