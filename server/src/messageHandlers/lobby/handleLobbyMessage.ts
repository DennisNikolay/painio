import { User, Application, Message, Lobby, MessageHandler } from "../../interfaces";
import { LOBBY_CODE_LENGTH, LOBBY_MAX_PLAYER, LOBBY_MIN_PLAYER } from '../../interfaces/Lobby';
import { CLIENT_LOBBY_STATE_MESSAGES, CLIENT_MESSAGE_LENGTH, } from "../../constants/ClientToServerMessages";
import { SERVER_ERROR_MESSAGES, SERVER_LOBBY_STATE_MESSAGES } from "../../constants/ServerToClientMessages";
import * as random from 'randomstring';



/**
 * handles messages regarding lobby. does not do anything if message does not regard lobby.
 * 
 * @param clientState the current state of the client
 * @param appState the current state of the complete application
 * @param msg the received message
 */
export const handleLobbyMessage: MessageHandler = (clientState: User, appState: Application, msg: Message) => {
    if(msg.cmd == CLIENT_LOBBY_STATE_MESSAGES.REQUEST_LOBBY){
        if(!errorHandler(clientState, msg)){
            return false;
        }
        if(msg.payload.requested_lobby == ""){
            handleNoLobbyRequested(clientState, appState, msg);
        }else{
            handleLobbyRequested(clientState, appState, msg);
        }
        let userLobby = appState.lobbies
        .filter(
            (element: Lobby) => element.lobbyCode == clientState.lobby
        )
        .map(
            (element: Lobby) => 
            {
                return( 
                    {
                        user_identifier: clientState.identifier,
                        lobbycode: element.lobbyCode, 
                        users: element.users.map((user: User) => {
                            return {
                                drawTool: user.drawTool, 
                                identifier: user.identifier
                            }
                        })
                    }
                )
            }
        )[0];
        clientState.socket.send(SERVER_LOBBY_STATE_MESSAGES.CONNECTION_ACCEPTED.concat(JSON.stringify(userLobby)));
    }
    return {clientState, appState};   
}



/**
 * Filters out all erroneous lobby messages. returns false if an error occured, returns true if msg is valid
 * 
 * @param clientState the current state of the client
 * @param msg the received message
 */
const errorHandler = (clientState: User, msg: Message) => {
    if(clientState.lobby != ""){
        clientState.socket.send(SERVER_ERROR_MESSAGES.PROTOCOL_ERROR("Already in lobby!"));
        clientState.socket.close();
        return false;
    }
    if(!msg.payload.hasOwnProperty("requested_lobby")){
        clientState.socket.send(SERVER_ERROR_MESSAGES.PROTOCOL_ERROR("Invalid payload, missing attribute requested_lobby!"));
        clientState.socket.close();
        return false;
    }
    if(msg.payload.requested_lobby.length != LOBBY_CODE_LENGTH && msg.payload.requested_lobby != ""){
        clientState.socket.send(SERVER_ERROR_MESSAGES.PROTOCOL_ERROR("Invalid payload, lobby code length invalid!"));
        clientState.socket.close();
        return false;
    }
    return true;
}

/**
 * Gets called if a lobby is requested and assigns user to the requested lobby
 * 
 * @param clientState the current state of the client
 * @param appState the current state of the complete application
 * @param msg the received message
 */
const handleLobbyRequested = (clientState: User, appState: Application, msg: Message) => {
    if(msg.payload.requested_lobby != ""){
        clientState.lobby = msg.payload.requested_lobby;

        ///TODO: Check if lobby is full. If yes, send error
        let userLobby = appState.lobbies.find(
            (element: Lobby) => element.lobbyCode == msg.payload.requested_lobby
        );
        
        if(userLobby != undefined){
            userLobby.users.forEach((user) => user.socket.send(SERVER_LOBBY_STATE_MESSAGES.NEW_USER.concat(JSON.stringify({...clientState.drawTool, identifier: clientState.identifier}))));
            userLobby.users.push(clientState); 
        }
        else{
            let lobby: Lobby = 
            {
                lobbyCode: msg.payload.requested_lobby,
                users: [clientState],
            }
            appState.lobbies.push(lobby);
        }
    }
}

/**
 * Gets called if no lobby is requested, assigns user to a valid, random lobby
 *  
 * @param clientState the current state of the client
 * @param appState the current state of the complete application
 * @param msg the received message
 */
const handleNoLobbyRequested = (clientState: User, appState: Application, msg: Message) => {
        let validLobbies: Lobby[] = appState.lobbies.filter(
            (element: Lobby) => (element.users.length < LOBBY_MAX_PLAYER) && (element.users.length > LOBBY_MIN_PLAYER)
        );
        if(validLobbies.length == 0){
            let newLobbyCode = random.generate(LOBBY_CODE_LENGTH);
            let lobby: Lobby = {
                lobbyCode: newLobbyCode,
                users: [clientState],
            }
            appState.lobbies.push(lobby);
            clientState.lobby = newLobbyCode;
        }else{
            let index: number = Math.floor(Math.random()*(validLobbies.length-1));
            clientState.lobby = validLobbies[index].lobbyCode;
            validLobbies[index].users.forEach((user) => user.socket.send(SERVER_LOBBY_STATE_MESSAGES.NEW_USER.concat(JSON.stringify({...clientState.drawTool, identifier: clientState.identifier}))));
            validLobbies[index].users.push(clientState);
        }
}

export default handleLobbyMessage;