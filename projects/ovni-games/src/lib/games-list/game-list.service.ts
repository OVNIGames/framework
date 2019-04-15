import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { ApolloQueryResult } from 'apollo-client';
import { GameInterface } from '../game/game.interface';
import { Observable, Observer } from 'rxjs';
import { ExtendMessage } from '../socket.service';

export interface GamesListInterface {
  top: GameInterface[];
  count: number;
  room: string;
}

export interface GamesListResultInterface {
  gamesList: GamesListInterface;
}

@Injectable({
  providedIn: 'root'
})
export class GameListService {
  protected list: GamesListInterface | null = null;

  constructor(private api: ApiService) {
  }

  get() {
    return new Observable((gamesListSubscription: Observer<GamesListInterface>) => {
      if (this.list) {
        gamesListSubscription.next(this.list);

        return;
      }

      this.api.query('gamesList', undefined, undefined, `
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
        gamesListSubscription.next(this.list = result.data.gamesList);
        this.api.join(this.list.room);
        this.api.onRoomExtend(this.list.room, (message: ExtendMessage<GamesListInterface>) => {
          (<any> Object).assign(this.list, message.properties);
        });
      });
    });
  }
}
