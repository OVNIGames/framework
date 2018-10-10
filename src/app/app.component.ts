import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'apollo-client/util/Observable';
import { UserInterface } from './user/user.interface';
import { ApiService } from './api.service';
import { UserService } from './user/user.service';
import { User } from './user/user';

@Component({
  selector: 'og-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  loading = true;
  user: UserInterface;
  commonTextWatched = false;
  commonText = '';

  private querySubscription: Subscription;

  constructor(private api: ApiService, private userService: UserService) {
  }

  updateWatcher() {
    this.api.toggleWatching('commonText', this.commonTextWatched);
  }

  sendCommonText() {
    this.api.sendMessage({
      commonText: this.commonText,
    });
  }

  ngOnInit() {
    this.api.getMessages().subscribe(msg => {
      if (msg['commonText']) {
        this.commonText = msg['commonText'];
      }
    });
    this.querySubscription = this.userService.getCurrent().subscribe((user: User) => {
      this.loading = false;
      this.user = user;
    });
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }
}
