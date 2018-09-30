import { Component, OnDestroy, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Subscription } from 'apollo-client/util/Observable';
import { SocketService } from './socket.service';
import { ApolloQueryResult } from 'apollo-client/core/types';
import { UsersQueryInterface } from './user.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  loading = true;
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
            users {
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
      });
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }
}
