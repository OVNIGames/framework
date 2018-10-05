import { Injectable } from '@angular/core';
import { ApolloQueryResult } from 'apollo-client/core/types';
import { ApiService } from '../api.service';
import { User } from '../user/user';
import { Observable } from 'rxjs';

export interface LoginResult {
  login: User | null;
}

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private api: ApiService) {
  }

  login(email: string, password: string, remember?: boolean): Observable<ApolloQueryResult<LoginResult>> {
    return this.api.mutate<LoginResult>('login', {
      email,
      password,
      remember,
    }, 'id,name,email');
  }

  getOauthService() {
    return this.api.query('oauth', null, 'code,name,login,callback,redirect,color,icon');
  }
}
