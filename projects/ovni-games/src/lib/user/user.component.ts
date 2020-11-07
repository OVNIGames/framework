import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FetchResult } from 'apollo-link';
import { of, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ApiService } from '../api.service';
import { findTimezone, getTimezoneName } from '../timezone-selector/find-timezone';
import { ITimezone } from '../timezone-selector/timezone.interface';
import { User } from './user';
import { IUser } from './user.interface';
import { UserService } from './user.service';

@Component({
  selector: 'og-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit, OnChanges {
  public loading = false;
  public editing = false;
  public changingPassword = false;
  public typingPassword = true;
  public typingCurrentPassword = true;
  public passwordLoading = false;
  public firstName = '';
  public lastName = '';
  public changePasswordForm = new FormGroup({
    currentPassword: new FormControl('', [
      Validators.required,
    ]),
    newPassword: new FormControl('', [
      Validators.required,
    ]),
    newPasswordAgain: new FormControl('', [
      Validators.required,
    ]),
  }, (formGroup: FormGroup): ValidationErrors | null => {
    if (formGroup.get('newPassword')?.value === formGroup.get('newPasswordAgain')?.value) {
      return null;
    }

    return { passwordMismatch: true };
  });
  public timezone?: ITimezone;
  @Input() public user: User;
  @Output() protected userLoggedOut: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('passwordModifier', {static: true}) protected passwordModifier: ElementRef;

  constructor(private userService: UserService, private api: ApiService, private snackBar: MatSnackBar) {
  }

  public ngOnInit(): void {
    this.userService.getCurrent().subscribe((user: User) => {
      user.getObservable().subscribe((user: User) => {
        this.user = user;
        this.extractUserData(user);
      });
    });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.user && changes.user.currentValue) {
      this.extractUserData(changes.user.currentValue);
    }
  }

  protected extractUserData(user: IUser): void {
    this.firstName = user.firstname || '';
    this.lastName = user.lastname || '';
    this.timezone = findTimezone(user.timezone);
  }

  public logout(): void {
    this.loading = true;
    this.firstName = '';
    this.lastName = '';
    this.timezone = undefined;
    this.userService.logout().subscribe(() => {
      this.userLoggedOut.emit(true);
      this.loading = false;
    });
  }

  public edit(): void {
    this.editing = true;
  }

  public cancel(): void {
    this.editing = false;
  }

  public changePassword(): void {
    this.changingPassword = true;
  }

  public cancelPasswordChange(): void {
    this.changingPassword = false;
  }

  public save(): void {
    const properties = {
      firstname: this.firstName,
      lastname: this.lastName,
      timezone: getTimezoneName(this.timezone),
    };
    this.user.update(properties);
    this.api.sendMessage({
      room: this.user.room,
      action: 'extend',
      properties,
    });
    this.user.name = `${this.firstName} ${this.lastName}`;
    this.editing = false;
  }

  public savePassword(): void {
    this.changePasswordForm.setErrors({});
    this.typingPassword = false;
    this.typingCurrentPassword = false;
    const controls = this.changePasswordForm.controls;

    if (controls.newPassword.value !== controls.newPasswordAgain.value) {
      this.changePasswordForm.setErrors({ passwordMismatch: true });
      controls.newPasswordAgain.setErrors({ passwordMismatch: true });

      return;
    }

    this.passwordLoading = true;

    this.api.mutate('updateUserPassword', {
      id: this.user.id,
      currentPassword: controls.currentPassword.value,
      password: controls.newPassword.value,
    }, this.userService.getUserDataFields()).pipe(
      switchMap((result: FetchResult<{ updateUserPassword: IUser }>) => {
        if (result?.data?.updateUserPassword) {
          return of(result.data);
        }

        const error = {
          // @ts-ignore
          message: 'Internal server error',
          debugMessage: null,
          ...((result.errors || [])[0] || {}),
        };

        return throwError(error.debugMessage || error.message)
      }),
    ).subscribe(
      () => {
        this.passwordLoading = false;
        this.changingPassword = false;
        this.changePasswordForm.reset();
        this.snackBar.open(this.passwordModifier.nativeElement.innerText);
      },
      () => {
        this.passwordLoading = false;
        setTimeout(() => {
          this.changePasswordForm.setErrors({ incorrect: true });
          controls.currentPassword.setErrors({ incorrect: true });
        });
      },
    );
  }
}
