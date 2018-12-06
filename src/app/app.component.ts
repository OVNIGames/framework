import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'apollo-client/util/Observable';
import { UserInterface } from '../../projects/ovni-games/src/lib/user/user.interface';
import { ApiService } from '../../projects/ovni-games/src/lib/api.service';
import { UserService } from '../../projects/ovni-games/src/lib/user/user.service';
import { User } from '../../projects/ovni-games/src/lib/user/user';
import { environment } from '../environments/environment';

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
    api.config(environment);
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
