import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserInterface } from '../user/user.interface';
import { FormControl, Validators } from '@angular/forms';
import { RegisterResult, RegisterService } from './register.service';
import { ApolloQueryResult } from 'apollo-client';

@Component({
  selector: 'og-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  @Input() allowRemember = true;
  @Output() userRegistered: EventEmitter<UserInterface> = new EventEmitter<UserInterface>();
  loading = false;
  remember = false;
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);
  passwordConfirmation = new FormControl('', [Validators.required]);

  constructor(private registerService: RegisterService) {
  }

  ngOnInit() {
    this.passwordConfirmation.valueChanges.subscribe(() => {
      if (this.passwordConfirmation.dirty && this.password.dirty && this.passwordConfirmation.value !== this.password.value) {
        this.passwordConfirmation.setErrors({
          confirmation: true,
        });

        return;
      }

      this.passwordConfirmation.clearValidators();
    });
  }

  register() {
    this.loading = true;
    this.registerService.register(
      this.email.value,
      this.password.value,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      true,
      this.remember
    ).subscribe((result: ApolloQueryResult<RegisterResult>) => {
      this.loading = false;
      if (result.data.register) {
        this.auth(result.data.register);

        return;
      }

      this.email.setErrors({
        badLogin: true,
      });
    });
  }

  auth(user: UserInterface) {
    this.userRegistered.emit(user);
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
