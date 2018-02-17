import * as WebSocket from 'ws';
import {Server} from 'http';
import {SERVER_LOBBY_STATE_MESSAGES} from "./constants/ServerToClientMessages";
import { User } from './User';
import { LobbyMessageHandler } from './lobby/LobbyMessageHandler';
import { Application } from './Application';
import { Lobby } from './lobby/Lobby'
import { DrawingHandler } from './drawing/DrawingHandler';

const EchoServer = (server: Server) => {
    let idCounter: number = 0;
    const ws = new WebSocket.Server({ server });
    let appState: Application = {
        lobbies: []
    };
    ws.on('connection', (ws: WebSocket) => {
        console.log("client connected");
        let clientState: User = {"lobby": "", "socket": ws, drawTool: {}, identifier: idCounter++};
        
        ws.on('message', (message: string) => {
            let newState = LobbyMessageHandler(clientState, appState, message);
            clientState = newState.clientState;
            appState = newState.appState;

            newState = DrawingHandler(clientState, appState, message);
            clientState = newState.clientState;
            appState = newState.appState;

        });
    
    });
    return ws;
} 


export default EchoServer;