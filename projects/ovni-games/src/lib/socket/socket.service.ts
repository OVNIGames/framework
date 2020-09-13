import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WrappedSocket as Socket } from './socket-io.service';

export interface IExtendMessage<T> extends MessageEvent {
  action: 'extend';
  properties: T;
  room: string;
}

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  constructor(private socket: Socket) {}

  public getMessages(): Observable<MessageEvent> {
    return this.socket.fromEvent<MessageEvent>('message');
  }

  public sendMessage(message: object): void {
    this.socket.emit('message', {
      data: message,
    });
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
}
