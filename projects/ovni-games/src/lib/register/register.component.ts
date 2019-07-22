import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ApolloQueryResult } from 'apollo-client';
import { IUser } from '../user/user.interface';
import { IRegisterResult, RegisterService } from './register.service';

@Component({
  selector: 'og-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  @Input() public allowRemember = true;
  @Output() public userRegistered: EventEmitter<IUser> = new EventEmitter<IUser>();
  public loading = false;
  public remember = false;
  public email = new FormControl('', [Validators.required, Validators.email]);
  public password = new FormControl('', [Validators.required]);
  public passwordConfirmation = new FormControl('', [Validators.required]);

  constructor(private registerService: RegisterService) {
  }

  public ngOnInit(): void {
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

  public register(): void {
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
    ).subscribe((result: ApolloQueryResult<IRegisterResult>) => {
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

  public auth(user: IUser): void {
    this.userRegistered.emit(user);
  }

  public getEmailErrorMessage(): string {
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

  public getPasswordErrorMessage(): string {
    return this.password.hasError('required') ?
      'You must enter a value' :
      '';
  }
}
