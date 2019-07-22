import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular-link-http';
import ApolloClient, { ApolloQueryResult } from 'apollo-client';
import { FetchResult } from 'apollo-link';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';
import { IApiServiceConfig } from './api.service.config';
import { createApollo } from './graphql.module';
import { IExtendMessage, SocketService } from './socket.service';

export interface IApiParameters {
  [key: string]: string | number | boolean | null;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  protected assetPrefix = '';
  protected extendCallbacks: Array<((message: IExtendMessage<object>) => void)> = [];

  constructor(private apollo: Apollo, private socket: SocketService, private httpLink: HttpLink) {
  }

  public config(config: IApiServiceConfig, overrideApolloClient: boolean = true): void {
    if (typeof config.graphql_uri !== 'undefined') {
      const client = this.apollo.getClient();

      if (!client) {
        this.apollo.setClient(new ApolloClient(createApollo(this.httpLink, config.graphql_uri, config.with_credentials !== false)));
      } else if (overrideApolloClient) {
        client.link = this.httpLink.create({
          uri: config.graphql_uri,
          withCredentials: config.with_credentials !== false,
        });
      }

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

  public getAssetPrefix(): string {
    return this.assetPrefix;
  }

  public getMessages(): Observable<MessageEvent> {
    return this.socket.getMessages().asObservable();
  }

  public sendMessage(message: object): void {
    this.socket.sendMessage(message);
  }

  public join(room: string): void {
    this.socket.join(room);
  }

  public leave(room: string): void {
    this.socket.leave(room);
  }

  public toggleWatching(room: string, watching: boolean): void {
    this.socket.toggleWatching(room, watching);
  }

  public query<T>(
    name: string,
    parameters?: IApiParameters | null,
    returnedDataFields?: string | string[] | null,
    returnedExtraFields?: string | string[] | null,
  ): Observable<ApolloQueryResult<T>> {
    const keys = parameters ? Object.keys(parameters) : [];
    const parametersString = parameters && keys.length ? `(${keys.map(key => {
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

  public mutate<T>(
    name: string,
    parameters?: object | IApiParameters | null,
    returnedFields?: string | string[] | null,
  ): Observable<FetchResult<T, Record<string, object>, Record<string, object>>> {
    const parametersString = parameters ? `(${Object.keys(parameters).map(key => {
      return `${key}: ${JSON.stringify(parameters[key])}`;
    }).join(', ')})` : '';
    if (returnedFields instanceof Array) {
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

  public onExtend<T>(callback: (message: IExtendMessage<T & object>) => void, room?: string): () => void {
    if (this.extendCallbacks.length) {
      this.getMessages().subscribe((message: IExtendMessage<T & object>) => {
        if (message.action === 'extend' && (!room || room === message.room)) {
          this.extendCallbacks.forEach(extendCallback => {
            extendCallback(message);
          });
        }
      });
    }

    this.extendCallbacks.push(callback);

    return () => {
      this.extendCallbacks = this.extendCallbacks.filter(c => c !== callback);
    };
  }

  public onRoomExtend<T>(room: string, callback: (message: IExtendMessage<T>) => void): () => void {
    return this.onExtend(callback, room);
  }
}
