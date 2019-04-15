import { Injectable } from '@angular/core';
import { User } from './user';
import { ApiParameters, ApiService } from '../api.service';
import { Observable, Observer, Subject } from 'rxjs';
import { ApolloQueryResult } from 'apollo-client';
import { UserInterface, UsersQueryInterface } from './user.interface';
import { LoginResultInterface } from '../login/login.service';
import { ExtendMessage } from '../socket.service';
import { AnonymousSubject } from 'rxjs/internal-compatibility';

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
    room
    games {
      name
    }
  `;

  constructor(private api: ApiService) {
    api.onExtend<UserInterface>((message: ExtendMessage<UserInterface>) => {
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

  getUserDataFields(): string {
    return this.userDataFields;
  }

  setUserDataFields(userDataFields: string) {
    this.userDataFields = userDataFields +
      (/(^|[\s,{}])id([\s,{}]|$)/.test(userDataFields) ? '' : '\nid') +
      (/(^|[\s,{}])room([\s,{}]|$)/.test(userDataFields) ? '' : '\nroom');
  }

  invalidCurrentUser() {
    if (this.currentUser.room) {
      this.api.leave(this.currentUser.room);
    }

    this.currentUser = null;
  }

  login(email: string, password: string, remember?: boolean): Promise<User | null> {
    return new Promise(resolve => {
      this.api.mutate<LoginResultInterface>('login', {
        email,
        password,
        remember,
      }, this.userDataFields).subscribe((result: ApolloQueryResult<LoginResultInterface>) => {
        if (!result.data.login) {
          resolve(null);

          return;
        }

        const user = new User(result.data.login, undefined, (properties: UserInterface) => {
          properties.id = user!.id;
          this.api.mutate<{updateUser: UserInterface}>('updateUser', properties, 'updated_at').subscribe((updateResult: ApolloQueryResult<{updateUser: UserInterface}>) => {
            user.updated_at = updateResult.data.updateUser!.updated_at;
          });
        });
        this.registerUser(user, true);
        resolve(user);
      });
    });
  }

  logout() {
    this.invalidCurrentUser();

    return this.api.mutate('logout');
  }

  unregisterUser(user: User) {
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

  registerUser(user: User, markAsCurrentUser?: boolean) {
    if (markAsCurrentUser) {
      this.currentUser = user;
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

  getRegisteredUser(parameters: object): User | null {
    if (parameters['current'] && this.currentUser) {
      return this.currentUser;
    }
    if (parameters['email']) {
      const email = parameters['email'].toLowerCase();
      if (this.usersByEmail[email]) {
        return this.usersByEmail[email];
      }
    }
    if (parameters['id']) {
      const id = (parameters['id'] + '').toLowerCase();
      if (this.usersById[id]) {
        return this.usersById[id];
      }
    }
    if (parameters['room'] && this.usersByRoom[parameters['room']]) {
      return this.usersByRoom[parameters['room']];
    }

    return null;
  }

  get(parameters: ApiParameters): Subject<User | null> {
    let user: User;
    const observable = new Observable((userSubscription: Observer<User | null>) => {
      const registeredUser = this.getRegisteredUser(parameters);
      if (registeredUser) {
        userSubscription.next(registeredUser);

        return;
      }

      this.api.query('users', parameters, this.userDataFields).subscribe((result: ApolloQueryResult<UsersQueryInterface>) => {
        if (!result.data.users.data[0]) {
          userSubscription.next(null);
          return;
        }
        user = new User(result.data.users.data[0], userSubscription, (properties: UserInterface) => {
          properties.id = user!.id;
          this.api.mutate<{updateUser: UserInterface}>('updateUser', properties, 'updated_at').subscribe((updateResult: ApolloQueryResult<{updateUser: UserInterface}>) => {
            user.updated_at = updateResult.data.updateUser!.updated_at;
          });
        });
        this.registerUser(user, !!parameters['current']);
        userSubscription.next(user);
      });
    });

    const observer = {
      next: (updateUser: User | null) => {
        if (user) {
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
      error: () => {},
      complete: () => {},
    };

    return new AnonymousSubject(observer, observable);
  }

  getCurrent(): Subject<User | null> {
    return this.get({current: true});
  }

  getById(id: number): Subject<User | null> {
    return this.get({id});
  }

  getByEmail(email: string): Subject<User | null> {
    return this.get({email});
  }

  update(id: number, properties: object) {
    return new Promise(resolve => {
      this.getById(id).subscribe((user: User) => {
        resolve(user.update(properties));
      });
    });
  }
}
