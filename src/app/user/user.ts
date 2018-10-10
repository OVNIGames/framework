import { UserInterface, UserModificationInterface } from './user.interface';
import { GameInterface } from '../game.interface';
import { Observer } from 'rxjs';

export class User implements UserInterface {
  __typename?: string;
  biography?: string;
  card_brand?: string;
  card_last_four?: string;
  checked?: boolean;
  created_at?: Date;
  deleted_at?: Date | null;
  email?: string;
  firstname?: string;
  games?: GameInterface[];
  id?: number;
  language?: string;
  last_action_at?: Date | null;
  last_network_event?: Date | null;
  lastname?: string;
  name?: string;
  password?: string;
  phone?: string;
  photo_updated_at?: Date | null;
  sex?: number;
  stripe_id?: string;
  room?: string;
  trial_ends_at?: Date | null;
  updated_at?: Date;

  constructor(properties: object, private subscription?: Observer<User>, private mutator?: (user: UserInterface) => void) {
    Object.assign(this, properties);
  }

  extend(properties: UserInterface) {
    Object.assign(this, properties);
    if (this.subscription) {
      this.subscription.next(this);
    }
    if (this.mutator) {
      this.mutator(properties);
    }

    return this;
  }

  kill() {
    this.subscription = null;

    return this;
  }
}
