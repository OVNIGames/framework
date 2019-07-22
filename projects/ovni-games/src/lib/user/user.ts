import { IUser } from './user.interface';
import { IGame } from '../game/game.interface';
import { Observable, Observer } from 'rxjs';
import { share } from 'rxjs/operators';

export class User implements IUser {
  __typename?: string;
  biography?: string;
  card_brand?: string;
  card_last_four?: string;
  checked?: boolean;
  created_at?: Date;
  deleted_at?: Date | null;
  email?: string;
  firstname?: string;
  games?: IGame[];
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
  private readonly observable: Observable<User>;
  private observableCallback: () => void = () => {};

  constructor(properties: object, private subscription?: Observer<User>, private mutator?: (user: IUser) => void) {
    this.assign(properties);

    this.observable = new Observable<User>(messenger => {
      this.observableCallback = () => {
        messenger.next(this);
      };

      return () => {
        this.observableCallback = () => {};
      };
    }).pipe(share());
  }

  getSubscription() {
    return this.subscription;
  }

  getObservable(): Observable<User> {
    return this.observable;
  }

  assign(properties: object) {
    (<any>Object).assign(this, properties);

    return this;
  }

  extend(properties: IUser) {
    this.assign(properties).observableCallback();

    return this;
  }

  update(properties: IUser) {
    this.extend(properties);
    if (this.subscription) {
      this.subscription.next(this);
    }
    if (this.mutator) {
      this.mutator(properties);
    }

    return this;
  }

  kill() {
    delete this.subscription;

    return this;
  }
}
