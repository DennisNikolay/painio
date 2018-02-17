import {CLIENT_LOBBY_STATE_MESSAGES, CLIENT_MESSAGE_LENGTH, } from "../constants/ClientToServerMessages";
import {SERVER_ERROR_MESSAGES, SERVER_ERROR_CODES, SERVER_LOBBY_STATE_MESSAGES} from "../constants/ServerToClientMessages";
import { User } from "../User";
import { Lobby, LOBBY_CODE_LENGTH, LOBBY_MAX_PLAYER, LOBBY_MIN_PLAYER } from './Lobby';
import { Application } from "../Application";
import * as random from 'randomstring';

export const LobbyMessageHandler = (clientState: User, appState: Application, msg: String) => {
    let command = msg.substr(0, CLIENT_MESSAGE_LENGTH);
    switch(command){
        case CLIENT_LOBBY_STATE_MESSAGES.REQUEST_LOBBY:
            if(clientState.lobby != ""){
                clientState.socket.send(SERVER_ERROR_MESSAGES.PROTOCOL_ERROR(SERVER_ERROR_CODES.ALREADY_IN_LOBBY));
            }
            //Does message contain payload? If yes assign to requested lobby, else assign random
            if(msg.length > command.length){
                let payload = msg.substr(CLIENT_MESSAGE_LENGTH);
                if(payload.length != LOBBY_CODE_LENGTH){
                    clientState.socket.send(SERVER_ERROR_MESSAGES.PROTOCOL_ERROR(SERVER_ERROR_CODES.LOBBY_CODE_LENGTH_INVALID));
                }
                clientState.lobby = payload;

                let userLobby = appState.lobbies.filter(
                    (element: Lobby) => element.lobbyCode == payload
                );

                if(userLobby.length > 0){
                    userLobby[0].users.push(clientState); 
                }else{
                    let lobby: Lobby = {
                        lobbyCode: payload,
                        users: [clientState],
                    }
                    appState.lobbies.push(lobby);
                 }
            }else{
                let validLobbies: Lobby[] = appState.lobbies.filter(
                    (element: Lobby) => element.users.length < LOBBY_MAX_PLAYER && element.users.length > LOBBY_MIN_PLAYER
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
                    let index: number = Math.floor(Math.random()*validLobbies.length)
                    clientState.lobby = validLobbies[index].lobbyCode;
                    validLobbies[index].users.push(clientState);
                }
            }
            let userLobby = appState.lobbies.filter((element: Lobby) => element.lobbyCode == clientState.lobby).map((element: Lobby) => {return {user_count: element.users.length, lobbyCode: element.lobbyCode}})[0];
            console.log(userLobby);
            clientState.socket.send(SERVER_LOBBY_STATE_MESSAGES.CONNECTION_ACCEPTED.concat(JSON.stringify(userLobby)));
        break;       
    }
    return {clientState, appState};
}

export default LobbyMessageHandler;