import { User, Lobby, Application, Message } from './interfaces';
import { SERVER_LOBBY_STATE_MESSAGES } from "./constants/ServerToClientMessages";
import { messageHandlers } from './messageHandlers';
import { parseData } from './socketDataHandlers/parseData';
import * as WebSocket from 'ws';
import {Server} from 'http';
import { ErrorSafeWebSocket } from './socketDataHandlers/ErrorSafeWebSocket';


/**
 * Intervall in ms in which ping messages are send
 */
const PING_TIME = 4000;

/** 
 * Time until user is timedout because missing pong messages
*/
const USER_TIMEOUT = 9000;



const EchoServer = (server: Server) => {
    let idCounter: number = 0;
    const ws = new WebSocket.Server({ server, clientTracking: true });
    let appState: Application = {
        lobbies: []
    };
    ws.on('connection', (ws: WebSocket) => {
        console.log("client connected");
        let safeSocket = new ErrorSafeWebSocket(ws);
        let clientState: User = {"lobby": "", "socket": safeSocket, drawTool: {}, identifier: idCounter++, lastPong: Date.now()};
        
        let pinger = setInterval(() => {
            safeSocket.send(SERVER_LOBBY_STATE_MESSAGES.PING.concat(JSON.stringify({})));
        }, PING_TIME);



        const disconnectUser = () => {
            clearInterval(pinger);
            console.log("Disconnect user with id: ".concat(clientState.identifier.toString()).concat(" ERROR/CLOSE"));
            appState.lobbies.forEach((lobby, index) =>{
                let userIndex = -1;
                let userToDelete = lobby.users.find((user, j) => {
                    userIndex = j;
                    return user.socket == new ErrorSafeWebSocket(ws);
                });
                if(userToDelete != undefined && userIndex != -1){
                    appState.lobbies[index].users.splice(userIndex,1);
                }
            })
            ws.close();
        }

        let checkConnection = setInterval(() => {
            appState.lobbies.forEach((lobby, lobbyIndex) => {
                lobby.users.forEach((user, userIndex) => {
                    if(Date.now() - user.lastPong > USER_TIMEOUT){
                        console.log("Removing user with id: ".concat(user.identifier.toString()).concat(" from lobby: ".concat(clientState.lobby)));
                        appState.lobbies[lobbyIndex].users.splice(userIndex,1);
                    }
                })
            })
        }, USER_TIMEOUT);

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