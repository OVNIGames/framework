import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { UserService } from './user.service';
import { User } from './user';

@Component({
  selector: 'og-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnChanges {
  loading = false;
  editing = false;
  firstName = '';
  lastName = '';
  @Input() user: User;
  @Output() userLoggedOut: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private userService: UserService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.user && changes.user.currentValue) {
      this.firstName = changes.user.currentValue.firstname || '';
      this.lastName = changes.user.currentValue.lastname || '';
    }
  }

  logout() {
    this.loading = true;
    this.firstName = '';
    this.lastName = '';
    this.userService.logout().subscribe(() => {
      this.userLoggedOut.emit(true);
      this.loading = false;
    });
  }

  edit() {
    this.editing = true;
  }

  cancel() {
    this.editing = false;
  }

  save() {
    this.user.extend({
      firstname: this.firstName,
      lastname: this.lastName,
    });
    this.user.name = `${this.firstName} ${this.lastName}`;
    this.editing = false;
  }
}
