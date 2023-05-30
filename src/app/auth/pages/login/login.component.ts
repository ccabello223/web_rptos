import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  authFormulario: FormGroup = this.fb.group({
    email_user: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor(private fb: FormBuilder, 
    private AuthService:AuthService,
    private router: Router){}

    login():void{
      const {email_user, password} = this.authFormulario.value;
      this.AuthService.login(email_user, password)
      .subscribe(ok => {
        if(ok === true){
            this.router.navigateByUrl('/rptos/productos')
        }
        else{
          Swal.fire('Error', ok, 'error')
        }
      })
  }
}
