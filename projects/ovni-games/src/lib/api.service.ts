import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { ExtendMessage, SocketService } from './socket.service';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';
import { ApolloQueryResult } from 'apollo-client';
import { HttpLink } from 'apollo-angular-link-http';
import { ApiServiceConfig } from './api.service.config';
import { FetchResult } from 'apollo-link';

export interface ApiParameters {
  [key: string]: string | number | boolean | null;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  protected assetPrefix = '';
  protected extendCallbacks: Array<((message: ExtendMessage<any>) => void)> = [];

  constructor(private apollo: Apollo, private socket: SocketService, private httpLink: HttpLink) {
  }

  config(config: ApiServiceConfig) {
    if (typeof config.graphql_uri !== 'undefined') {
      this.apollo.getClient().link = this.httpLink.create({
        uri: config.graphql_uri,
        withCredentials: config.with_credentials !== false,
      });

      if (/^(https?:\/\/[^\/]+)(\/.*)?$/.test(config.graphql_uri)) {
        this.assetPrefix = RegExp.$1;
      }
    }
    if (typeof config.socket_secure !== 'undefined' || typeof config.socket_uri !== 'undefined') {
      const socketUri = config.socket_uri || '';
      const socketSecure = typeof config.socket_secure === 'undefined' ? true : config.socket_secure;
      this.socket.connect(socketUri, socketSecure);
    }
  }

  getAssetPrefix() {
    return this.assetPrefix;
  }

  getMessages() {
    return this.socket.getMessages();
  }

  sendMessage(message: Object) {
    this.socket.sendMessage(message);
  }

  join(room: string) {
    this.socket.join(room);
  }

  leave(room: string) {
    this.socket.leave(room);
  }

  toggleWatching(room: string, watching: boolean) {
    this.socket.toggleWatching(room, watching);
  }

  query<T>(name: string, parameters?: ApiParameters, returnedDataFields?: string | string[], returnedExtraFields?: string | string[]): Observable<ApolloQueryResult<T>> {
    const parametersString = parameters ? `(${Object.keys(parameters).map(key => {
      return `${key}: ${JSON.stringify(parameters[key])}`;
    }).join(', ')})` : '';
    if (returnedDataFields && typeof returnedDataFields === 'object') {
      returnedDataFields = returnedDataFields.join(',');
    }
    if (returnedExtraFields && typeof returnedExtraFields === 'object') {
      returnedExtraFields = returnedExtraFields.join(',');
    }

    return this.apollo.watchQuery<T>({
      query: gql`
        {
          ${name}${parametersString} {${returnedDataFields ? `data{${returnedDataFields}}` : ''}${returnedExtraFields || ''}}
        }
      `,
    }).valueChanges;
  }

  mutate<T>(name: string, parameters?: object, returnedFields?: string | string[]): Observable<FetchResult<T, Record<string, any>, Record<string, any>>> {
    const parametersString = parameters ? `(${Object.keys(parameters).map(key => {
      return `${key}: ${JSON.stringify(parameters[key])}`;
    }).join(', ')})` : '';
    if (typeof returnedFields === 'object') {
      returnedFields = returnedFields.join(',');
    }
    returnedFields = returnedFields ? `{${returnedFields}}` : '';

    return this.apollo.mutate<T>({
      mutation: gql`
        mutation {
          ${name}${parametersString} ${returnedFields}
        }
      `,
    });
  }

  onExtend<T>(callback: (message: ExtendMessage<T>) => void, room?: string) {
    if (this.extendCallbacks.length) {
      this.getMessages().subscribe((message: ExtendMessage<T>) => {
        if (message.action === 'extend' && (!room || room === message.room)) {
          this.extendCallbacks.forEach(callback => {
            callback(message);
          });
        }
      });
    }

    this.extendCallbacks.push(callback);

    return () => {
      this.extendCallbacks = this.extendCallbacks.filter(c => c !== callback);
    };
  }

  onRoomExtend<T>(room: string, callback: (message: ExtendMessage<T>) => void) {
    return this.onExtend(callback, room);
  }
}
