import { Component, OnInit } from '@angular/core';
import { LanguageInterface } from '../language.interface';
import { ApiService } from '../api.service';
import { ApolloQueryResult } from 'apollo-client';
import { GameInterface } from '../game/game.interface';

interface LanguagesResultInterface {
  languages: {
    data: LanguageInterface[];
  };
}

export interface GameResultInterface {
  createGame: GameInterface | null;
}
const languages: LanguageInterface[] = [];

@Component({
  selector: 'og-game-creator',
  templateUrl: './game-creator.component.html',
  styleUrls: ['./game-creator.component.css'],
})
export class GameCreatorComponent implements OnInit {
  public game: GameInterface | null = null;
  public name = '';
  public languages: LanguageInterface[] = languages;
  public defaultLanguageId: number | null = null;
  public submitting = false;

  constructor(private api: ApiService) {
  }

  ngOnInit() {
    this.api.query('languages', {
      page_size: 200,
    }, 'id,code,name,native_name').subscribe((result: ApolloQueryResult<LanguagesResultInterface>) => {
      this.languages.push.apply(this.languages, result.data.languages.data);
    });
  }

  create() {
    this.submitting = true;
    this.api.mutate<GameResultInterface>('createGame', {
      name: this.name,
      default_language_id: this.defaultLanguageId,
    }, `
      id
      room
      code
      name
      default_language {
        name
        native_name
      }
    `).subscribe((result: ApolloQueryResult<GameResultInterface>) => {
      this.submitting = false;
      this.game = result.data.createGame;
    });
  }

  dump() {
    return JSON.stringify(this.game, null, 2);
  }
}
