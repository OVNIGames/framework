import { Injectable } from '@angular/core';
import { FetchResult } from 'apollo-link';
import { Observable } from 'rxjs';
import { ApiService } from '../api.service';
import { User } from '../user/user';

export interface IRegisterResult {
  register: User | null;
}

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  constructor(private api: ApiService) {
  }

  public register(
    email: string,
    password: string,
    firstname?: string,
    lastname?: string,
    language?: string,
    biography?: string,
    sex?: number | null,
    phone?: string,
    photo?: File,
    login?: boolean,
    remember?: boolean
  ): Observable<FetchResult<IRegisterResult, Record<string, object>, Record<string, object>>> {
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

    for (const key in parameters) {
      if (parameters[key] === null) {
        delete parameters[key];
      }
    }

    return this.api.mutate<IRegisterResult>('register', parameters, 'id,name,email');
  }
}
