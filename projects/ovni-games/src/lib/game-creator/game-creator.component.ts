import { Component, OnInit } from '@angular/core';
import { ApolloQueryResult } from 'apollo-client';
import { ApiService } from '../api.service';
import { IGame } from '../game/game.interface';
import { ILanguage } from '../language.interface';

interface ILanguagesResult {
  languages: {
    data: ILanguage[];
  };
}

export interface IGameResult {
  createGame: IGame | null;
}

const languages: ILanguage[] = [];

@Component({
  selector: 'og-game-creator',
  templateUrl: './game-creator.component.html',
  styleUrls: ['./game-creator.component.css'],
})
export class GameCreatorComponent implements OnInit {
  public game: IGame | null = null;
  public name = '';
  public languages: ILanguage[] = languages;
  public defaultLanguageId: number | null = null;
  public submitting = false;

  constructor(private api: ApiService) {
  }

  public ngOnInit(): void {
    this.api.query('languages', {
      page_size: 200,
    }, 'id,code,name,native_name').subscribe((result: ApolloQueryResult<ILanguagesResult>) => {
      this.languages.push.apply(this.languages, result.data.languages.data);
    });
  }

  public create(): void {
    this.submitting = true;
    this.api.mutate<IGameResult>('createGame', {
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
    `).subscribe((result: ApolloQueryResult<IGameResult>) => {
      this.submitting = false;
      this.game = result.data.createGame;
    });
  }

  public dump(): string {
    return JSON.stringify(this.game, null, 2);
  }
}
