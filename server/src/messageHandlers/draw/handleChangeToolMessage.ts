import { User, Application, Lobby, Message, MessageHandler } from "../../interfaces";
import { CLIENT_MESSAGE_LENGTH, CLIENT_DRAW_MESSAGES } from '../../constants/ClientToServerMessages';
import { SERVER_DRAW_MESSAGES, SERVER_ERROR_MESSAGES } from '../../constants/ServerToClientMessages';

const TOOL_INTERFACE = {
    id: "", 
    thickness: "",
    color: "",
    type: "",
    user: "",
}

/**
 * Handles change tool messages, does nothing if message is not change tool message
 *
 * 
 * @param clientState the current state of the client
 * @param appState the current state of the complete application
 * @param msg the received message
 */
export const handleChangeToolMessage: MessageHandler = (clientState: User, appState: Application, msg: Message) => {
    if(msg.cmd == CLIENT_DRAW_MESSAGES.CHANGE_TOOL){
        if(!errorHandler(clientState, msg)){
            return false;
        }
        clientState.drawTool = msg.payload;
        let ownLobby = appState.lobbies.filter((element: Lobby) => element.lobbyCode == clientState.lobby)[0];
        ownLobby.users.forEach(
            (user: User) => {
                let newPayload = { ...msg.payload, user: clientState.identifier.toString() }
                user.socket.send(SERVER_DRAW_MESSAGES.CHANGE_TOOL.concat(JSON.stringify(newPayload)));
            }
        );
    }
    return {clientState, appState}
}


/**
 * Filters out all erroneous lobby messages. returns false if an error occured, returns true if msg is valid
 * 
 * @param clientState the current state of the client
 * @param msg the received message
 */
const errorHandler = (clientState: User, msg: Message) => {
    for (let key in TOOL_INTERFACE){
        if(!msg.payload.hasOwnProperty(key)){
            clientState.socket.send(SERVER_ERROR_MESSAGES.PROTOCOL_ERROR("Invalid payload, missing property ".concat(key).concat("!")));
            clientState.socket.close();
            return false;
        }
    }
    return true;
}