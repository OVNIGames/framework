import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { SocketService } from './socket.service';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';
import { ApolloQueryResult } from 'apollo-client';
import { FetchResult } from 'apollo-link';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private apollo: Apollo, private socket: SocketService) {
  }

  getMessages() {
    return this.socket.getMessages();
  }

  sendMessage(message: Object) {
    return this.socket.sendMessage(message);
  }

  query<T>(name: string, parameters?: object, returnedDataFields?: string | string[], returnedExtraFields?: string | string[]): Observable<ApolloQueryResult<T>> {
    const parametersString = parameters ? `(${Object.keys(parameters).map(key => {
      return `${key}: ${JSON.stringify(parameters[key])}`;
    }).join(', ')})` : '';
    if (typeof returnedDataFields === 'object') {
      returnedDataFields = returnedDataFields.join(',');
    }
    if (typeof returnedExtraFields === 'object') {
      returnedExtraFields = returnedExtraFields.join(',');
    }

    return this.apollo
      .watchQuery<T>({
        query: gql`
          {
            ${name}${parametersString} {data{${returnedDataFields || 'id'}}${returnedExtraFields || ''}}
          }
        `,
      })
      .valueChanges;
  }

  mutate<T>(name: string, parameters?: object, returnedFields?: string | string[]): Observable<FetchResult<T>> {
    const parametersString = parameters ? `(${Object.keys(parameters).map(key => {
      return `${key}: ${JSON.stringify(parameters[key])}`;
    }).join(', ')})` : '';
    if (typeof returnedFields === 'object') {
      returnedFields = returnedFields.join(',');
    }
    returnedFields = returnedFields ? `{${returnedFields}}` : '';

    return this.apollo
      .mutate<T>({
        mutation: gql`
          mutation {
            ${name}${parametersString} ${returnedFields}
          }
        `,
      });
  }
}
