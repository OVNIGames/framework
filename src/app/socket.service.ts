import { Observable, Subject } from 'rxjs';

const uri = 'http://localhost:3042';

import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from '../environments/environment';

@Injectable()
export class SocketService {

  private readonly messages: Subject<MessageEvent>;
  private socket;

  constructor() {
    this.messages = this.connect();
  }

  getMessages() {
    return this.messages;
  }

  sendMessage(message: Object) {
    return this.messages.next(new MessageEvent('message', {
      data: message,
    }));
  }

  connect(): Subject<MessageEvent> {
    this.socket = io(environment.socket_uri);

    window.onbeforeunload = () => {
      this.socket.close();
    };

    const observable = new Observable(observer => {
      this.socket.on('message', data => {
        observer.next(data);
      });

      return () => {
        this.socket.disconnect();
      };
    });

    const observer = {
      next: (data: MessageEvent) => {
        this.socket.emit('message', JSON.stringify(data.data));
      },
    };

    return Subject.create(observer, observable);
  }
}
