import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { UserService } from './user.service';
import { User } from './user';

@Component({
  selector: 'og-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit, OnChanges {
  protected loading = false;
  protected editing = false;
  protected firstName = '';
  protected lastName = '';
  @Input() protected user: User;
  @Output() protected userLoggedOut: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.userService.getCurrent().subscribe((user: User) => {
      user.getObservable().subscribe((user: User) => {
        this.user = user;
        this.firstName = user.firstname;
        this.lastName = user.lastname;
      });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.user && changes.user.currentValue) {
      this.firstName = changes.user.currentValue.firstname || '';
      this.lastName = changes.user.currentValue.lastname || '';
    }
  }

  logout(): void {
    this.loading = true;
    this.firstName = '';
    this.lastName = '';
    this.userService.logout().subscribe(() => {
      this.userLoggedOut.emit(true);
      this.loading = false;
    });
  }

  edit(): void {
    this.editing = true;
  }

  cancel(): void {
    this.editing = false;
  }

  save(): void {
    this.user.update({
      firstname: this.firstName,
      lastname: this.lastName,
    });
    this.user.name = `${this.firstName} ${this.lastName}`;
    this.editing = false;
  }
}
