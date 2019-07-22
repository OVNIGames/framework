import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ApiService, IUser, User, UserService } from '@ovnigames/framework';
import { Subscription } from 'apollo-client/util/Observable';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  public guestPage: boolean;
  public loading = true;
  public user: IUser;
  public commonTextWatched = false;
  public commonText = '';

  private querySubscription: Subscription;

  constructor(private api: ApiService, private userService: UserService, private router: Router) {
    api.config(environment);
  }

  public ngOnInit() {
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

  public ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }

  public updateWatcher() {
    this.api.toggleWatching('commonText', this.commonTextWatched);
  }

  public sendCommonText() {
    this.api.sendMessage({
      commonText: this.commonText,
    });
  }
}
