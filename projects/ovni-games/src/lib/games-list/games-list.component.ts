import { Component, OnInit } from '@angular/core';
import { ApolloQueryResult } from 'apollo-client';
import { ApiService } from '../api.service';
import { IGame } from '../game/game.interface';

interface IGamesList {
  top: IGame[];
  count: number;
}

interface IGamesListResult {
  gamesList: IGamesList;
}

@Component({
  selector: 'og-games-list',
  templateUrl: './games-list.component.html',
  styleUrls: ['./games-list.component.css'],
})
export class GamesListComponent implements OnInit {
  public list: IGamesList | null = null;
  public creating = false;

  constructor(private api: ApiService) {
  }

  public ngOnInit(): void {
    this.api.query('gamesList', undefined, undefined, `
      top {
        id
        code
        name
        owner {
          name
        }
      }
      count
    `).subscribe((result: ApolloQueryResult<IGamesListResult>) => {
      this.list = result.data.gamesList;
    });
  }

  public create(): void {
    this.creating = true;
  }
}
