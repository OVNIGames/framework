import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { ExtendMessage, SocketService } from './socket.service';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';
import { ApolloQueryResult } from 'apollo-client';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  protected extendCallbacks: Array<((message: ExtendMessage) => void)> = [];

  constructor(private apollo: Apollo, private socket: SocketService) {
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

  query<T>(name: string, parameters?: object, returnedDataFields?: string | string[], returnedExtraFields?: string | string[]): Observable<ApolloQueryResult<T>> {
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

  mutate<T>(name: string, parameters?: object, returnedFields?: string | string[]): Observable<ApolloQueryResult<T>> {
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

  onExtend<T>(callback: (message: ExtendMessage) => void, room?: string) {
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

  onRoomExtend<T>(room: string, callback: (message: ExtendMessage) => void) {
    return this.onExtend(callback, room);
  }
}
