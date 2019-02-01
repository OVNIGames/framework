import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'apollo-client/util/Observable';
import { ApiService, UserInterface, UserService, User } from '@ovnigames/framework';
import { environment } from '../environments/environment';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  guestPage: boolean;
  loading = true;
  user: UserInterface;
  commonTextWatched = false;
  commonText = '';

  private querySubscription: Subscription;

  constructor(private api: ApiService, private userService: UserService, private router: Router) {
    api.config(environment);
  }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.guestPage = /^\/?doc(\/.*)?$/.test(this.router.url);
      }
    });
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

  updateWatcher() {
    this.api.toggleWatching('commonText', this.commonTextWatched);
  }

  sendCommonText() {
    this.api.sendMessage({
      commonText: this.commonText,
    });
  }
}
