import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserInterface } from './user.interface';
import { ApiService } from '../api.service';

@Component({
  selector: 'og-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  loading = false;
  @Input() user: UserInterface;
  @Output() onUserLoggedOut: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private api: ApiService) {
  }

  ngOnInit() {
  }

  logout() {
    this.loading = true;
    this.api.mutate('logout').subscribe(() => {
      this.onUserLoggedOut.emit(true);
      this.loading = false;
    });
  }
}
