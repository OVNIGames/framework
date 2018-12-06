import { GameInterface } from '../game/game.interface';
import { QueryInterface } from '../query.interface';

export interface UserInterface {
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
  stripe_id?: string;
  card_brand?: string;
  card_last_four?: string;
  language?: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date|null;
  photo_updated_at?: Date|null;
  last_action_at?: Date|null;
  trial_ends_at?: Date|null;
  last_network_event?: Date|null;
  games?: GameInterface[];
  __typename?: string;
}

export interface UsersQueryInterface {
  users: QueryInterface<UserInterface[]>;
}

