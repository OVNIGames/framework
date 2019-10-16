import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular-link-http';
import ApolloClient, { ApolloQueryResult } from 'apollo-client';
import { ApolloLink, FetchResult } from 'apollo-link';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IApiServiceConfig } from './api.service.config';
import { createApollo } from './graphql.module';
import { PaginationDataSource } from './pagination-data-source';
import { IPagination } from './pagination.interface';
import { IExtendMessage, SocketService } from './socket.service';

export interface IApiParameters {
  [key: string]: string | number | boolean | null;
}

export type IApiParametersInput = string | object | IApiParameters | null;

export function formatApiParameters(parameters: IApiParametersInput | undefined): string {
  if (!parameters) {
    return '';
  }

  if (typeof parameters === 'string') {
    return parameters;
  }

  return `(${Object.keys(parameters)
    .map(key => {
      return `${key}: ${JSON.stringify(parameters[key])}`;
    })
    .join(', ')})`;
}

export function formatVariableType(name: string, variable: unknown) {
  if (/Id$/.test(name)) {
    return 'ID';
  }

  if (variable instanceof File) {
    return 'Upload!';
  }

  const type = typeof variable;

  return type.substr(0, 1).toUpperCase() + type.substr(1);
}

export function formatVariablesString(variables: Record<string, unknown> | null | undefined) {
  const variablesNames = Object.keys(variables || {});

  return variablesNames.length
    ? `(${variablesNames.map(name => {
        return `$${name}: ${formatVariableType(name, (variables as Record<string, unknown>)[name])}`;
      })})`
    : '';
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  protected assetPrefix = '';
  protected extendCallbacks: Array<(message: IExtendMessage<object>) => void> = [];
  protected headers = new HttpHeaders();

  constructor(private apollo: Apollo, private socket: SocketService, private httpLink: HttpLink) {}

  protected getResponseInterceptor(): ApolloLink {
    // tslint:disable-next-line:no-any
    return new ApolloLink((op, forward: (op: any) => any) => {
      return forward(op).map((data: object) => {
        const context = op.getContext();
        const response: HttpResponse<FetchResult> = context.response;
        const token = response.headers.get('X-CSRF-TOKEN');

        if (this.headers && token) {
          this.headers.set('X-CSRF-TOKEN', token);
        }

        return data;
      });
    });
  }

  public getApollo(): Apollo {
    return this.apollo;
  }

  public config(config: IApiServiceConfig, overrideApolloClient: boolean = true): void {
    if (typeof config.graphql_uri !== 'undefined') {
      const client = this.apollo.getClient();
      const headers = this.headers;

      if (!client) {
        const withCredentials = config.with_credentials !== false;
        const clientConfig = createApollo(this.httpLink, config.graphql_uri, withCredentials, this.getResponseInterceptor(), headers);
        this.apollo.setClient(new ApolloClient(clientConfig));
      } else if (overrideApolloClient) {
        client.link = this.getResponseInterceptor().concat(
          this.httpLink.create({
            headers,
            uri: config.graphql_uri,
            withCredentials: config.with_credentials !== false,
          })
        );
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
    parameters?: IApiParametersInput,
    returnedDataFields?: string | string[] | null,
    returnedExtraFields?: string | string[] | null,
    variables?: Record<string, unknown> | null
  ): Observable<ApolloQueryResult<T>> {
    const parametersString = formatApiParameters(parameters);

    if (returnedDataFields && typeof returnedDataFields === 'object') {
      returnedDataFields = returnedDataFields.join(',');
    }

    if (returnedExtraFields && typeof returnedExtraFields === 'object') {
      returnedExtraFields = returnedExtraFields.join(',');
    }

    return this.apollo.watchQuery<T>({
      query: gql`
        query q${formatVariablesString(variables)} {
          ${name}${parametersString} {${returnedDataFields ? `data{${returnedDataFields}}` : ''}${returnedExtraFields || ''}}
        }
      `,
      variables: variables as Record<string, unknown>,
    }).valueChanges;
  }

  public mutate<T>(
    name: string,
    parameters?: IApiParametersInput,
    returnedFields?: string | string[] | null,
    variables?: Record<string, unknown>,
    context?: unknown
  ): Observable<FetchResult<T, Record<string, object>, Record<string, object>>> {
    const parametersString = formatApiParameters(parameters);

    if (returnedFields instanceof Array) {
      returnedFields = returnedFields.join(',');
    }

    returnedFields = returnedFields ? `{${returnedFields}}` : '';

    return this.apollo.mutate<T>({
      mutation: gql`
        mutation mut${formatVariablesString(variables)} {
          ${name}${parametersString} ${returnedFields}
        }
      `,
      variables,
      context,
    });
  }

  public upload<T>(
    name: string,
    parameters?: IApiParametersInput,
    returnedFields?: string | string[] | null,
    variables?: Record<string, unknown>,
    context?: unknown
  ): Observable<FetchResult<T, Record<string, object>, Record<string, object>>> {
    return this.mutate<T>(
      name,
      parameters,
      returnedFields,
      variables,
      Object.assign(
        {
          useMultipart: true,
        },
        context
      )
    );
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

  public getPage<T>(query: string, variables: Record<string, unknown>, pageSize = 50, page = 1): Observable<IPagination<T>> {
    return this.apollo
      .watchQuery<ApolloQueryResult<Record<string, IPagination<T>>>>({
        query,
        variables: Object.assign({}, variables, {
          page,
          pageSize,
        }),
      })
      .valueChanges.pipe(
        map(result => {
          let data: IPagination<T> = {};

          if (!Object.keys(result.data).some(key => {
            if (result.data[key].data && typeof result.data[key].total !== 'undefined') {
              data = result.data[key];

              return true;
            }

            return false;
          })) {
            throw new Error('No {data, total} object found.');
          }

          return data;
        })
      );
  }

  public paginate<T>(
    query: string,
    variables: Record<string, unknown>,
    initialPageSize = 50,
    initialPage = 1
  ): Observable<PaginationDataSource<T>> {
    return this.getPage<T>(query, variables, initialPageSize, initialPage).pipe(
      map(
        initialResult =>
          new PaginationDataSource<T>(
            (page, pageSize) => this.getPage<T>(query, variables, pageSize, (page || 0) + 1).pipe(map(result => result.data as T[])),
            initialResult.total as number,
            initialPageSize,
            { [initialPageSize - 1]: initialResult.data as T[] }
          )
      )
    );
  }
}
