import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import * as ioBase from 'socket.io-client';
const io = (ioBase as any).default ? (ioBase as any).default : ioBase;

export interface ExtendMessage<T> extends MessageEvent {
  action: 'extend';
  properties: T;
  room: string;
}

@Injectable({
  providedIn: 'root',
})
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
    this.messages.next(new MessageEvent('message', {
      data: message,
    }));
  }

  join(room: string) {
    this.sendMessage({
      join: room,
    });
  }

  leave(room: string) {
    this.sendMessage({
      leave: room,
    });
  }

  toggleWatching(room: string, watching: boolean) {
    this.sendMessage({
      [watching ? 'join' : 'leave']: room,
    });
  }

  connect(socketUri: string = '', socketSecure: boolean = true): Subject<MessageEvent> {
    if (this.socket) {
      this.socket.close();
    }

    this.socket = io(socketUri, {
      path: '/socket.io',
      transports: ['websocket'],
      secure: socketSecure,
    });

    window.addEventListener('beforeunload', () => {
      this.socket.close();
    });

    const observable = new Observable(messenger => {
      this.socket.on('message', data => {
        messenger.next(data);
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
