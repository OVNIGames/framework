import { Injectable } from '@angular/core';
import { ApolloQueryResult } from 'apollo-client';
import { FetchResult } from 'apollo-link';
import { BehaviorSubject, Observable, Observer, Subject } from 'rxjs';
import { AnonymousSubject } from 'rxjs/internal-compatibility';
import { IRawUser, ITimezone } from '../..';
import { ApiService, IApiParameters } from '../api.service';
import { ILoginResult } from '../login/login.service';
import { IExtendMessage } from '../socket/socket.service';
import { User } from './user';
import { IUser, IUsersQuery } from './user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  protected currentUser: User | null = null;
  protected usersByRoom: {[room: string]: User} = {};
  protected usersById: {[id: number]: User} = {};
  protected usersByEmail: {[email: string]: User} = {};
  protected userDataFields = `
    id
    firstname
    lastname
    name
    timezone
    room
    games {
      name
    }
  `;
  protected currentUserSubject = new BehaviorSubject<User | null>(null);
  protected logoutSubject = new Subject<User>();
  protected loginSubject = new Subject<{user: User, remember: boolean | undefined}>();
  protected loginAttemptSubject = new Subject<{email: string, remember: boolean | undefined}>();

  public userChanges = this.currentUserSubject.asObservable();
  public loggedOut = this.logoutSubject.asObservable();
  public loggedIn = this.loginSubject.asObservable();
  public loginAttempted = this.loginAttemptSubject.asObservable();

  constructor(private api: ApiService) {
    api.onExtend<IUser>((message: IExtendMessage<IUser>) => {
      const user = this.getRegisteredUser({room: message.room});

      if (user) {
        user.extend(message.properties);
        const subscription = user.getSubscription();

        if (subscription) {
          subscription.next(user);
        }
      }
    });
  }

  public getUserDataFields(): string {
    return this.userDataFields;
  }

  public setUserDataFields(userDataFields: string): void {
    this.userDataFields = userDataFields +
      (/(^|[\s,{}])id([\s,{}]|$)/.test(userDataFields) ? '' : '\nid') +
      (/(^|[\s,{}])room([\s,{}]|$)/.test(userDataFields) ? '' : '\nroom');
  }

  public invalidCurrentUser(): void {
    if (this.currentUser && this.currentUser.room) {
      this.api.leave(this.currentUser.room);
    }

    this.setCurrentUser(null);
  }

  public login(email: string, password: string, remember?: boolean): Promise<User | null> {
    this.loginAttemptSubject.next({email, remember});

    return new Promise(resolve => {
      this.api.mutate<ILoginResult>('login', {
        email,
        password,
        remember,
      }, this.userDataFields).subscribe((result: ApolloQueryResult<ILoginResult>) => {
        if (!result.data.login) {
          resolve(null);

          return;
        }

        const user = new User(result.data.login, undefined, (properties: IUser) => {
          if (user) {
            properties.id = user.id;
          }

          this.api.mutate<{updateUser: IRawUser}>('updateUser', properties, 'updated_at')
            .subscribe(updateResult => {
              if (updateResult?.data?.updateUser) {
                user.assign({
                  updated_at: updateResult.data.updateUser.updated_at,
                });
              }
            });
        });

        this.registerUser(user, true);
        resolve(user);
        this.loginSubject.next({user, remember});
      });
    });
  }

  public logout(): Observable<FetchResult<{logout: boolean}, Record<string, object>, Record<string, object>>> {
    if (this.currentUser) {
      this.logoutSubject.next(this.currentUser);
    }

    this.invalidCurrentUser();

    return this.api.mutate('logout');
  }

  public unregisterUser(user: User): void {
    if (user.email && this.usersByEmail[user.email]) {
      delete this.usersByEmail[user.email];
    }

    if (user.id && this.usersByEmail[user.id]) {
      delete this.usersByEmail[user.id];
    }

    if (user.room) {
      if (this.usersByRoom[user.room]) {
        delete this.usersByRoom[user.room];
      }

      this.api.leave(user.room);
    }

    user.kill();
  }

  public registerUser(user: User, markAsCurrentUser?: boolean): void {
    if (markAsCurrentUser) {
      this.setCurrentUser(user);
    }

    if (user.email) {
      this.usersByEmail[user.email.toLowerCase()] = user;
    }

    if (user.id) {
      this.usersById[(user.id + '').toLowerCase()] = user;
    }

    if (user.room) {
      this.usersByRoom[user.room] = user;
      this.api.join(user.room);
    }
  }

  public getRegisteredUser(parameters: {[name: string]: unknown}): User | null {
    if (parameters && parameters.current && this.currentUser) {
      return this.currentUser;
    }

    if (parameters && typeof parameters.email === 'string') {
      const email = parameters.email.toLowerCase();

      if (this.usersByEmail[email]) {
        return this.usersByEmail[email];
      }
    }

    if (parameters && parameters.id) {
      const id = (parameters.id + '').toLowerCase();

      if (this.usersById[id]) {
        return this.usersById[id];
      }
    }

    if (parameters && (typeof parameters.room === 'string' || typeof parameters.room === 'number') && this.usersByRoom[parameters.room]) {
      return this.usersByRoom[parameters.room];
    }

    return null;
  }

  public get(parameters: IApiParameters): Subject<User | null> {
    let user: User;

    const observable = new Observable((userSubscription: Observer<User | null>) => {
      const registeredUser = this.getRegisteredUser(parameters);

      if (registeredUser) {
        userSubscription.next(registeredUser);

        return;
      }

      this.api.query('users', parameters, this.userDataFields).subscribe((result: ApolloQueryResult<IUsersQuery>) => {
        if (!result.data.users.data[0]) {
          userSubscription.next(null);

          return;
        }

        user = new User(result.data.users.data[0], userSubscription, (properties: IUser) => {
          if (user) {
            properties.id = user.id;
          }

          this.api.mutate<{updateUser: IRawUser}>('updateUser', properties, 'updated_at')
            .subscribe(updateResult => {
              if (updateResult?.data?.updateUser) {
                user.assign({
                  updated_at: updateResult.data.updateUser.updated_at,
                });
              }
            });
        });

        this.registerUser(user, !!parameters.current);
        userSubscription.next(user);
      });
    });

    const observer = {
      next: (updateUser: User | null) => {
        if (user && updateUser) {
          let touched = false;
          const properties = {};

          Object.keys(updateUser).forEach(key => {
            if (updateUser[key] !== user[key]) {
              properties[key] = updateUser[key];
              touched = true;
            }
          });

          if (touched) {
            user.update(properties);
          }
        }
      },
      error: () => {
        // noop
      },
      complete: () => {
        // noop
      },
    };

    return new AnonymousSubject(observer, observable);
  }

  public getCurrent(): Subject<User | null> {
    return this.get({current: true});
  }

  public getById(id: number): Subject<User | null> {
    return this.get({id});
  }

  public getByEmail(email: string): Subject<User | null> {
    return this.get({email});
  }

  public update(id: number, properties: object) {
    return new Promise(resolve => {
      this.getById(id).subscribe((user: User) => {
        resolve(user.update(properties));
      });
    });
  }

  public updateTimezone(id: number, timezone: ITimezone | string | number) {
    if (typeof timezone === 'number') {
      timezone = timezone.toString();
    }

    if (typeof timezone !== 'string') {
      timezone = timezone.utc[0];
    }

    return this.update(id, {timezone});
  }

  protected setCurrentUser(user: User | null | undefined | false) {
    this.currentUser = user || null;
    this.currentUserSubject.next(this.currentUser);
  }
}
