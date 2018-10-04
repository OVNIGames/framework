import { Injectable } from '@angular/core';
import { User } from '../user/user';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  constructor(private method: (email: string, password: string, firstname?: string, lastname?: string, language?: string, biography?: string, sex?: number | null, phone?: string, photo?: File, login?: boolean, remember?: boolean) => User) {
  }

  register(email: string, password: string, firstname?: string, lastname?: string, language?: string, biography?: string, sex?: number | null, phone?: string, photo?: File, login?: boolean, remember?: boolean): User {
    return this.method(email, password, firstname, lastname, language, biography, sex, phone, photo, login, remember);
  }
}
