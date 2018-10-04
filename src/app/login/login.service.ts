import { Injectable } from '@angular/core';
import { ApolloQueryResult } from 'apollo-client/core/types';
import { ApiService } from '../api.service';
import { User } from '../user/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private api: ApiService) {
  }

  login(email: string, password: string, remember?: boolean): Observable<ApolloQueryResult<User | null>> {
    return this.api.mutate<User | null>('login', {
      email,
      password,
      remember
    }, 'id,name,email');
  }
}
