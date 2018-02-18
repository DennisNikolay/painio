import * as WebSocket from 'ws';

export class ErrorSafeWebSocket extends WebSocket{

    public send(data: any){
        if(this.readyState == WebSocket.OPEN)
            return super.send(data);
        else return false;
    }
}