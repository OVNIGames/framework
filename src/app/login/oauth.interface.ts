import { QueryInterface } from '../query.interface';
import { SafeHtml } from '@angular/platform-browser';

export interface OauthInterface {
  code: string;
  name: string;
  login: string;
  callback: string;
  redirect: string;
  color: string;
  icon: string;
  svg?: SafeHtml;
}

export interface OauthQueryInterface {
  oauth: QueryInterface<OauthInterface[]>;
}
