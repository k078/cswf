import { Component} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'
import { isEmpty, isNotEmpty } from 'class-validator';
import { AuthService } from '../auth.service';


@Component({
  selector: 'cswf-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.maxLength(150)]],
        password: ['', [Validators.required, Validators.maxLength(30)]],
    });
  }

  login():void {
    console.log('LoginComponent login()');
    if (this.loginForm.valid) {
        const email = this.loginForm.value.username;
        const password = this.loginForm.value.password;
        this.authService
        .login(email, password)
        .subscribe((user) => {
            console.log('Ingelogd user:', user);
            this.router.navigateByUrl('/');
        },
        (error: any) => {
            console.error('Fout bij het inloggen van user:', error);
        }
        );
    }
  }
}
