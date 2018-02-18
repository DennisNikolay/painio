import { User, Lobby, Application, Message } from './interfaces';
import { SERVER_LOBBY_STATE_MESSAGES } from "./constants/ServerToClientMessages";
import { messageHandlers } from './messageHandlers';
import { parseData } from './socketDataHandlers/parseData';
import * as WebSocket from 'ws';
import {Server} from 'http';


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
            let msg: false|Message = parseData(message, ws);
            console.log(msg);
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