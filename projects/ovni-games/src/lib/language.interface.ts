import { GameInterface } from './game/game.interface';

export interface LanguageInterface {
  id?: number;
  code?: string;
  name?: string;
  native_name?: string;
  games?: GameInterface;
  __typename: string;
}
