import { UserInterface } from './user.interface';
import { GameInterface } from '../game.interface';

export class User implements UserInterface {
  __typename: string;
  biography: string;
  card_brand: string;
  card_last_four: string;
  checked: boolean;
  created_at: Date;
  deleted_at: Date | null;
  email: string;
  firstname: string;
  games: GameInterface[];
  id: number;
  language: string;
  last_action_at: Date | null;
  last_network_event: Date | null;
  lastname: string;
  name: string;
  password: string;
  phone: string;
  photo_updated_at: Date | null;
  sex: number;
  stripe_id: string;
  trial_ends_at: Date | null;
  updated_at: Date;

  constructor(data: object) {
    Object.assign(this, data);
  }
}
