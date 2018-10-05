import { Component, Input, OnInit } from '@angular/core';
import { LoginResult, LoginService } from './login.service';
import { User } from '../user/user';
import { ApolloQueryResult } from 'apollo-client';
import { FormControl, Validators } from '@angular/forms';
import { OauthInterface, OauthQueryInterface } from './oauth.interface';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

const baseUrl = location.href.replace(/[?&](oauthError|error|oauthRedirect)(=[^&]+)?/g, '') + (location.href.indexOf('?') === -1 ? '?' : '&');

@Component({
  selector: 'og-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  @Input() allowRemember = true;
  @Input() allowOAuth = true;
  readonly oauthRedirectUrl = baseUrl + 'oauthRedirect';
  readonly oauthErrorUrl = baseUrl + 'oauthError';
  loading = true;
  oAuthLoading = true;
  remember = false;
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);
  oauthServices: OauthInterface[];

  constructor(private loginService: LoginService, private http: HttpClient, private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.loading = false;
    if (!this.allowOAuth) {
      this.oAuthLoading = false;

      return;
    }

    this.loginService.getOauthService().subscribe((result: ApolloQueryResult<OauthQueryInterface>) => {
      this.oauthServices = result.data.oauth.data.map(service => {
        service.login += (service.login.indexOf('?') === -1 ? '?' : '&') + `redirect_url=${encodeURIComponent(this.oauthRedirectUrl)}&error_url=${encodeURIComponent(this.oauthErrorUrl)}`;

        return service;
      });
      Promise.all(this.oauthServices.map(service => {
        return new Promise(resolve => {
          this.http.get(service.icon, {responseType: 'text'}).subscribe((svgBody: string) => {
            service.svg = this.sanitizer.bypassSecurityTrustHtml(svgBody);
            resolve();
          });
        });
      })).then(() => {
        this.oAuthLoading = false;
      });
    });
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
