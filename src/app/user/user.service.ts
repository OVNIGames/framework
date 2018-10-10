import { Injectable } from '@angular/core';
import { User } from './user';
import { ApiService } from '../api.service';
import { Observable, Observer, Subject } from 'rxjs';
import { ApolloQueryResult } from 'apollo-client';
import { UserInterface, UserModificationInterface, UsersQueryInterface } from './user.interface';
import { FetchResult } from 'apollo-link';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private currentUser: User;
  private usersByRoom: {[room: string]: User} = {};
  private usersById: {[id: number]: User} = {};
  private usersByEmail: {[email: string]: User} = {};

  constructor(private api: ApiService) {
    api.getMessages().subscribe((message: MessageEvent) => {
      if (message.data) {
        console.log(message.data);
      }
    });
  }

  invalidCurrentUser() {
    if (this.currentUser.room) {
      this.api.leave(this.currentUser.room);
    }
    this.currentUser = null;
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

    return null;
  }

  get(parameters: object): Subject<User> {
    let user: User;
    const observable = new Observable((userSubscription: Observer<User>) => {
      const registeredUser = this.getRegisteredUser(parameters);
      if (registeredUser) {
        userSubscription.next(registeredUser);

        return;
      }

      this.api.query('users', parameters, `
        id
        firstname
        lastname
        name
        room
        games {
          name
        }
      `).subscribe((result: ApolloQueryResult<UsersQueryInterface>) => {
        user = new User(result.data.users.data[0], userSubscription, (properties: UserInterface) => {
          properties.id = user.id;
          this.api.mutate<UserInterface>('updateUser', properties, 'updated_at').subscribe((updateResult: FetchResult<UserInterface>) => {
            console.log(updateResult);
            user.updated_at = updateResult.context.updated_at;
          });
        });
        this.registerUser(user, parameters['current']);
        userSubscription.next(user);
      });
    });

    const observer = {
      next: (updateUser: User) => {
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
            user.extend(properties);
          }
        }
      },
    };

    return Subject.create(observer, observable);
  }

  getCurrent(): Subject<User> {
    return this.get({current: true});
  }

  getById(id: number): Subject<User> {
    return this.get({id});
  }

  getByEmail(email: string): Subject<User> {
    return this.get({email});
  }

  update(id: number, properties: object) {
    return new Promise(resolve => {
      this.getById(id).subscribe((user: User) => {
        resolve(user.extend(properties));
      });
    });
  }
}
