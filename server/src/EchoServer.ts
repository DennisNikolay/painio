import * as WebSocket from 'ws';
import {Server} from 'http';


const EchoServer = (server: Server) => {

    const ws = new WebSocket.Server({ server });
    ws.on('connection', (ws: WebSocket) => {
        
        console.log("client connected");

        ws.on('message', (message: string) => {
            console.log('received: %s', message);
            ws.send(`Echo: ${message}`);
        });
    
    });
    return ws;
} 


export default EchoServer;