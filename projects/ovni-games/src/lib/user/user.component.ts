import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ITimezone, IUser } from '../..';
import { findTimezone, getTimezoneName } from '../timezone-selector/find-timezone';
import { UserService } from './user.service';
import { User } from './user';

@Component({
  selector: 'og-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit, OnChanges {
  public loading = false;
  public editing = false;
  public firstName = '';
  public lastName = '';
  public timezone?: ITimezone;
  @Input() public user: User;
  @Output() protected userLoggedOut: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private userService: UserService) {
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

  public save(): void {
    this.user.update({
      firstname: this.firstName,
      lastname: this.lastName,
      timezone: getTimezoneName(this.timezone),
    });
    this.user.name = `${this.firstName} ${this.lastName}`;
    this.editing = false;
  }
}
