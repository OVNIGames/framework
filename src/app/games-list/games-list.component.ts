import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { ApolloQueryResult } from 'apollo-client';
import { GameInterface } from '../game.interface';

interface GamesListInterface {
  top: GameInterface[];
  count: number;
}

interface GamesListResultInterface {
  gamesList: GamesListInterface;
}

@Component({
  selector: 'og-games-list',
  templateUrl: './games-list.component.html',
  styleUrls: ['./games-list.component.css'],
})
export class GamesListComponent implements OnInit {
  private list

  constructor(private api: ApiService) {
  }

  ngOnInit() {
    this.api.query('gamesList', null, null, `
      top {
        id
        name
        owner {
          name
        }
      }
      count
    `).subscribe((result: ApolloQueryResult<GamesListResultInterface>) => {
      this.list = result.data.gamesList;
    });
  }

}
