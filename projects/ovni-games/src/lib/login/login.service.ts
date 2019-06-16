import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { User } from '../user/user';
import { UserService } from '../user/user.service';
import { Observable } from 'rxjs';
import { ApolloQueryResult } from 'apollo-client';
import { OauthQueryInterface } from './oauth.interface';

export interface LoginResultInterface {
  login: User | null;
}

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private api: ApiService, private userService: UserService) {
  }

  login(email: string, password: string, remember?: boolean): Promise<User | null> {
    return this.userService.login(email, password, remember);
  }

  getOauthService(): Observable<ApolloQueryResult<OauthQueryInterface>> {
    return this.api.query('oauth', undefined, 'code,name,login,callback,redirect,color,icon');
  }
}
