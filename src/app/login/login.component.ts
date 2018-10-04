import { Component } from '@angular/core';
import { LoginService } from './login.service';
import { User } from '../user/user';
import { ApolloQueryResult } from 'apollo-client';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loading = false;
  remember = false;
  email = '';
  password = '';

  constructor(private loginService: LoginService) {
  }

  login() {
    this.loading = true;
    this.loginService.login(this.email, this.password, this.remember).subscribe((result: ApolloQueryResult<User>) => {
      console.log(result);
      this.loading = false;
    });
  }

}
