import { Component } from '@angular/core';
import { LoginResult, LoginService } from './login.service';
import { User } from '../user/user';
import { ApolloQueryResult } from 'apollo-client';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loading = false;
  remember = false;
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);

  constructor(private loginService: LoginService) {
  }

  login() {
    this.loading = true;
    this.loginService.login(this.email.value, this.password.value, this.remember).subscribe((result: ApolloQueryResult<LoginResult>) => {
      this.loading = false;
      console.log(result, result.data, result.data.login);
      if (result.data.login) {
        this.auth(result.data.login);

        return;
      }

      console.log(this.email);
      this.email.setErrors({
        badLogin: true,
      });
      console.log(this.email.errors);
    });
  }

  auth(user: User) {

  }

  getEmailErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }
    if (this.email.hasError('email')) {
      return 'Not a valid email';
    }
    if (this.email.hasError('badLogin')) {
      return 'Wrong e-mail address or password';
    }
    return '';
  }

  getPasswordErrorMessage() {
    return this.password.hasError('required') ?
      'You must enter a value' :
      '';
  }
}
