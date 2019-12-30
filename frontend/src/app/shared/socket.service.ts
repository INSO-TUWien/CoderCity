import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(private socket: Socket) { }

  sendMessage(): void {
    this.socket.emit('message', 'test');
  }

  receiveMessage(): void {
    this.socket.on('git', (message) => {
      console.log(`Received message ${message}`);
    });
  }
}
