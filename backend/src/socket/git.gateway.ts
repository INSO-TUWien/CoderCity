import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayInit } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { GitService } from 'src/services/git/git.service';

@WebSocketGateway()
export class GitGateway implements OnGatewayInit {

  private readonly logger = new Logger(GitGateway.name);

  constructor(private readonly service: GitService) {
  }

  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    this.logger.log(`init`);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: string): string {
    this.logger.log(`Received message over socket ${client} message: ${payload}`);

    return 'Hello world!';
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket, ...args: any[]) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}
