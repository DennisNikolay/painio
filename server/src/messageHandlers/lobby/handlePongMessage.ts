import { User, Application, Message, Lobby, MessageHandler } from "../../interfaces";
import { LOBBY_CODE_LENGTH, LOBBY_MAX_PLAYER, LOBBY_MIN_PLAYER } from '../../interfaces/Lobby';
import { CLIENT_LOBBY_STATE_MESSAGES, CLIENT_MESSAGE_LENGTH, } from "../../constants/ClientToServerMessages";
import { SERVER_ERROR_MESSAGES, SERVER_LOBBY_STATE_MESSAGES } from "../../constants/ServerToClientMessages";
import * as random from 'randomstring';



/**
 * updates users pong time whenever any message is recieved, thereby also handles pong messages
 * 
 * @param clientState the current state of the client
 * @param appState the current state of the complete application
 * @param msg the received message
 */
export const handlePongMessage: MessageHandler = (clientState: User, appState: Application, msg: Message) => {
    if(msg.cmd == CLIENT_LOBBY_STATE_MESSAGES.PONG){
        clientState.lastPong = Date.now();
    }
    return {clientState, appState};   
}

