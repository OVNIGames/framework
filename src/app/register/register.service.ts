import { Injectable } from '@angular/core';
import { User } from '../user/user';
import { ApolloQueryResult } from 'apollo-client/core/types';
import { ApiService } from '../api.service';
import { Observable } from 'rxjs/index';

export interface RegisterResult {
  register: User | null;
}

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  constructor(private api: ApiService) {
  }

  register(email: string, password: string, firstname?: string, lastname?: string, language?: string, biography?: string, sex?: number | null, phone?: string, photo?: File, login?: boolean, remember?: boolean): Observable<ApolloQueryResult<RegisterResult>> {
    const parameters = {
      email,
      password,
      firstname,
      lastname,
      language,
      biography,
      sex,
      phone,
      photo,
      login,
      remember,
    };
    for (let key in parameters) {
      if (parameters[key] === null) {
        delete parameters[key];
      }
    }

    return this.api.mutate<RegisterResult>('register', parameters, 'id,name,email');
  }
}
