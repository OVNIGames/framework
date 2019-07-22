import { SafeHtml } from '@angular/platform-browser';
import { IQuery } from '../query.interface';

export interface IOauth {
  code: string;
  name: string;
  login: string;
  callback: string;
  redirect: string;
  color: string;
  icon: string;
  svg?: SafeHtml;
}

export interface IOauthQuery {
  oauth: IQuery<IOauth[]>;
}
