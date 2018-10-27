import { LanguageInterface } from './language.interface';
import { UserInterface } from './user/user.interface';

export interface GameInterface {
  id?: number;
  room?: string;
  code?: string;
  name?: string;
  default_language?: LanguageInterface;
  default_language_id?: number;
  owner?: UserInterface;
  owner_id?: number;
  __typename: string;
}
