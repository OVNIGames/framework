import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { User } from '../user/user';
import { UserService } from '../user/user.service';

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

  getOauthService() {
    return this.api.query('oauth', undefined, 'code,name,login,callback,redirect,color,icon');
  }
}
