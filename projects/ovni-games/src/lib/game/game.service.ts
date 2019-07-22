import { Injectable } from '@angular/core';
import { ApolloQueryResult } from 'apollo-client';
import { Observable, Observer } from 'rxjs';
import { IGamesListResult } from '../..';
import { ApiService } from '../api.service';
import { IExtendMessage } from '../socket.service';
import { IGame } from './game.interface';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  protected list: IGame | null = null;

  constructor(private api: ApiService) {
  }

  public get(): Observable<IGame> {
    return new Observable((gamesListSubscription: Observer<IGame>) => {
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
      `).subscribe((result: ApolloQueryResult<IGamesListResult>) => {
        gamesListSubscription.next(this.list = result.data.gamesList[0]);

        if (this.list && this.list.room) {
          this.api.join(this.list.room);
          this.api.onRoomExtend(this.list.room, (message: IExtendMessage<IGame>) => {
            Object.assign(this.list, message.properties);
          });
        }
      });
    });
  }
}
