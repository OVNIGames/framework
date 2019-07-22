import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import * as ioBase from 'socket.io-client';
const io = (ioBase as any).default ? (ioBase as any).default : ioBase;

export interface IExtendMessage<T> extends MessageEvent {
  action: 'extend';
  properties: T;
  room: string;
}

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private readonly messages: Subject<MessageEvent>;
  private socket: SocketIOClient.Socket;

  constructor() {
    this.messages = this.connect();
  }

  public getMessages(): Subject<MessageEvent> {
    return this.messages;
  }

  public sendMessage(message: object): void {
    this.messages.next(new MessageEvent('message', {
      data: message,
    }));
  }

  public join(room: string): void {
    this.sendMessage({
      join: room,
    });
  }

  public leave(room: string): void {
    this.sendMessage({
      leave: room,
    });
  }

  public toggleWatching(room: string, watching: boolean): void {
    this.sendMessage({
      [watching ? 'join' : 'leave']: room,
    });
  }

  public connect(socketUri: string = '', socketSecure: boolean = true): Subject<MessageEvent> {
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
      this.socket.on('message', (data: MessageEvent) => {
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
