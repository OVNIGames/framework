import { Component, OnDestroy, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Subscription } from 'apollo-client/util/Observable';
import { SocketService } from './socket.service';
import { ApolloQueryResult } from 'apollo-client/core/types';
import { UserInterface, UsersQueryInterface } from './user/user.interface';

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

  constructor(private apollo: Apollo, private socket: SocketService) {
  }

  updateWatcher() {
    this.socket.sendMessage({
      [this.commonTextWatched ? 'join' : 'leave']: 'commonText',
    });
  }

  sendCommonText() {
    this.socket.sendMessage({
      commonText: this.commonText,
    });
  }

  ngOnInit() {
    this.socket.getMessages().subscribe(msg => {
      if (msg['commonText']) {
        this.commonText = msg['commonText'];
      }
    });
    this.querySubscription = this.apollo
      .watchQuery({
        query: gql`
          {
            users(current: true) {
              data {
                name
                games {
                  name
                }
              }
            }
          }
        `,
      })
      .valueChanges
      .subscribe((result: ApolloQueryResult<UsersQueryInterface>) => {
        this.loading = result.loading;
        this.user = result.data.users.data[0];
      });
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }
}
