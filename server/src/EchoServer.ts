import { User, Lobby, Application, Message } from './interfaces';
import { SERVER_LOBBY_STATE_MESSAGES } from "./constants/ServerToClientMessages";
import { messageHandlers } from './messageHandlers';
import { parseData } from './socketDataHandlers/parseData';
import * as WebSocket from 'ws';
import {Server} from 'http';
import { ErrorSafeWebSocket } from './socketDataHandlers/ErrorSafeWebSocket';


const EchoServer = (server: Server) => {
    let idCounter: number = 0;
    const ws = new WebSocket.Server({ server, clientTracking: true });
    let appState: Application = {
        lobbies: []
    };
    ws.on('connection', (ws: WebSocket) => {
        console.log("client connected");
        let safeSocket = new ErrorSafeWebSocket(ws);
        let clientState: User = {"lobby": "", "socket": safeSocket, drawTool: {}, identifier: idCounter++};
        
        const disconnectUser = () => {
            appState.lobbies.forEach((lobby, index) =>{
                let userIndex = -1;
                let userToDelete = lobby.users.find((user, j) => {
                    userIndex = j;
                    return user.socket == new ErrorSafeWebSocket(ws);
                });
                if(userToDelete != undefined && userIndex != -1){
                    delete appState.lobbies[index].users[userIndex];
                }
            })
            ws.close();
        }

        ws.onclose = disconnectUser;
        ws.onerror = disconnectUser

        ws.on('message', (message: string) => {
            let msg: false|Message = parseData(message, ws);
            //console.log(msg);
            let newState = {clientState, appState, message: msg};
            let continueHandling = msg;
            messageHandlers.forEach((handler) => {
                if(continueHandling){
                    let result = handler(newState.clientState, newState.appState, <Message>msg);
                    if(result == false){
                        continueHandling = false;
                    }else{
                        result = <{clientState:User, appState: Application}> result;
                        newState = {...result, message:<Message>msg};
                    }
                }
            });
        });
    });
    return ws;
} 


export default EchoServer;