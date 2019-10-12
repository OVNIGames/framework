import { IGame } from '../game/game.interface';
import { IQuery } from '../query.interface';

export interface IUserBase {
  id?: number;
  room?: string;
  name?: string;
  lastname?: string;
  firstname?: string;
  email?: string;
  password?: string;
  checked?: boolean;
  biography?: string;
  phone?: string;
  sex?: number;
  timezone?: string;
  stripe_id?: string;
  card_brand?: string;
  card_last_four?: string;
  language?: string;
  games?: IGame[];
  __typename?: string;
}

export interface IRawUser extends IUserBase {
  created_at?: string;
  updated_at?: string;
  deleted_at?: string|null;
  photo_updated_at?: string|null;
  last_action_at?: string|null;
  trial_ends_at?: string|null;
  last_network_event?: string|null;
}

export interface IUser extends IUserBase {
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date|null;
  photo_updated_at?: Date|null;
  last_action_at?: Date|null;
  trial_ends_at?: Date|null;
  last_network_event?: Date|null;
}

export interface IUsersQuery {
  users: IQuery<IUser[]>;
}
