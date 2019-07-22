import { Injectable } from '@angular/core';
import { ApolloQueryResult } from 'apollo-client';
import { Observable } from 'rxjs';
import { ApiService } from '../api.service';
import { User } from '../user/user';
import { UserService } from '../user/user.service';
import { IOauthQuery } from './oauth.interface';

export interface ILoginResult {
  login: User | null;
}

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private api: ApiService, private userService: UserService) {
  }

  public login(email: string, password: string, remember?: boolean): Promise<User | null> {
    return this.userService.login(email, password, remember);
  }

  public getOauthService(): Observable<ApolloQueryResult<IOauthQuery>> {
    return this.api.query('oauth', undefined, 'code,name,login,callback,redirect,color,icon');
  }
}
