import * as WebSocket from 'ws';

export class ErrorSafeWebSocket{

    private socket: WebSocket;

    constructor(ws: WebSocket){
        this.socket = ws;
    }

    public send(data: any){
        if(this.socket.readyState == WebSocket.OPEN){
            this.socket.send(data);
            return true;
        }
        else return false;
    }

    public close(){
        this.socket.close();
    }
    
    public equals(socket: ErrorSafeWebSocket){
        return this.socket == socket.socket;
    }

}