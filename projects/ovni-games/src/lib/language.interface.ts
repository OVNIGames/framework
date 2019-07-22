import { IGame } from './game/game.interface';

export interface ILanguage {
  id?: number;
  code?: string;
  name?: string;
  native_name?: string;
  games?: IGame;
  __typename: string;
}
