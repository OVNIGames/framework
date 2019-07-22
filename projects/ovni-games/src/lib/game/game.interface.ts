import { ILanguage } from '../language.interface';
import { IUser } from '../user/user.interface';

export interface IGame {
  id?: number;
  room?: string;
  code?: string;
  name?: string;
  default_language?: ILanguage;
  default_language_id?: number;
  owner?: IUser;
  owner_id?: number;
  __typename: string;
}
