import * as WebSocket from 'ws';
import {Server} from 'http';
import {SERVER_LOBBY_STATE_MESSAGES} from "./constants/ServerToClientMessages";
import { User } from './User';
import { LobbyMessageHandler } from './lobby/LobbyMessageHandler';
import { Application } from './Application';
import { Lobby } from './lobby/Lobby'

const EchoServer = (server: Server) => {

    const ws = new WebSocket.Server({ server });
    let appState: Application = {
        lobbies: []
    };
    ws.on('connection', (ws: WebSocket) => {
        console.log("client connected");
        let clientState: User = {"lobby": "", "socket": ws};
        ws.send(SERVER_LOBBY_STATE_MESSAGES.CONNECTION_ACCEPTED);
        
        ws.on('message', (message: string) => {
            let newState = LobbyMessageHandler(clientState, appState, message);
            clientState = newState.clientState;
            appState = newState.appState;


            if(message.startsWith("SAY") && message.length>3){
                let userLobby: Lobby = appState.lobbies.filter((element: Lobby) => element.lobbyCode == clientState.lobby)[0];
                userLobby.users.forEach(
                    (user: User) => {
                        user.socket.send(message.substring(3));
                    }
                );
            }


        });
    
    });
    return ws;
} 


export default EchoServer;