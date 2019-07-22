import { Injectable } from '@angular/core';
import { ApolloQueryResult } from 'apollo-client';
import { Observable, Observer } from 'rxjs';
import { ApiService } from '../api.service';
import { IGame } from '../game/game.interface';
import { IExtendMessage } from '../socket.service';

export interface IGamesList {
  top: IGame[];
  count: number;
  room: string;
}

export interface IGamesListResult {
  gamesList: IGamesList;
}

@Injectable({
  providedIn: 'root',
})
export class GameListService {
  protected list: IGamesList | null = null;

  constructor(private api: ApiService) {
  }

  public get(): Observable<IGamesList> {
    return new Observable((gamesListSubscription: Observer<IGamesList>) => {
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
      `).subscribe((result: ApolloQueryResult<IGamesListResult>) => {
        gamesListSubscription.next(this.list = result.data.gamesList);
        this.api.join(this.list.room);
        this.api.onRoomExtend(this.list.room, (message: IExtendMessage<IGamesList>) => {
          Object.assign(this.list, message.properties);
        });
      });
    });
  }
}
