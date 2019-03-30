import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { ApolloQueryResult } from 'apollo-client';
import { Observable, Observer } from 'rxjs';
import { ExtendMessage } from '../socket.service';
import { GameInterface } from './game.interface';
import { GamesListResultInterface } from '../..';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  protected list: GameInterface | null = null;

  constructor(private api: ApiService) {
  }

  get() {
    return new Observable((gamesListSubscription: Observer<GameInterface>) => {
      if (this.list) {
        gamesListSubscription.next(this.list);

        return;
      }

      this.api.query('gamesList', null, null, `
        top {
          id
          name
          owner {
            name
          }
        }
        count
        room
      `).subscribe((result: ApolloQueryResult<GamesListResultInterface>) => {
        gamesListSubscription.next(this.list = result.data.gamesList[0]);

        if (this.list && this.list.room) {
          this.api.join(this.list.room);
          this.api.onRoomExtend(this.list.room, (message: ExtendMessage<GameInterface>) => {
            (<any> Object).assign(this.list, message.properties);
          });
        }
      });
    });
  }
}
