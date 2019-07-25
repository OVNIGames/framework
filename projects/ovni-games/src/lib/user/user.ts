import { Observable, Observer } from 'rxjs';
import { share } from 'rxjs/operators';
import { IGame } from '../game/game.interface';
import { IUser } from './user.interface';

export class User implements IUser {
  public __typename?: string;
  public biography?: string;
  public card_brand?: string;
  public card_last_four?: string;
  public checked?: boolean;
  public created_at?: Date;
  public deleted_at?: Date | null;
  public email?: string;
  public firstname?: string;
  public games?: IGame[];
  public id?: number;
  public language?: string;
  public last_action_at?: Date | null;
  public last_network_event?: Date | null;
  public lastname?: string;
  public name?: string;
  public password?: string;
  public phone?: string;
  public photo_updated_at?: Date | null;
  public sex?: number;
  public stripe_id?: string;
  public timezone?: string;
  public room?: string;
  public trial_ends_at?: Date | null;
  public updated_at?: Date;
  private readonly observable: Observable<User>;
  private observableCallback: () => void = (() => {
    // noop
  });

  constructor(properties: object, private subscription?: Observer<User>, private mutator?: (user: IUser) => void) {
    this.assign(properties);

    this.observable = new Observable<User>(messenger => {
      this.observableCallback = () => {
        messenger.next(this);
      };

      return () => {
        this.observableCallback = () => {
        };
      };
    }).pipe(share());
  }

  public getSubscription(): Observer<User> | undefined {
    return this.subscription;
  }

  public getObservable(): Observable<User> {
    return this.observable;
  }

  public assign(properties: object): User {
    Object.assign(this, properties);

    return this;
  }

  public extend(properties: IUser): User {
    this.assign(properties).observableCallback();

    return this;
  }

  public update(properties: IUser): User {
    for (const key in properties) {
      if (typeof properties[key] === 'undefined') {
        delete properties[key];
      }
    }

    this.extend(properties);

    if (this.subscription) {
      this.subscription.next(this);
    }

    if (this.mutator) {
      this.mutator(properties);
    }

    return this;
  }

  public kill(): User {
    delete this.subscription;

    return this;
  }
}
