import { User } from "../User";
import { Application } from "../Application";
import { CLIENT_MESSAGE_LENGTH, CLIENT_DRAW_MESSAGES } from '../constants/ClientToServerMessages';
import { Lobby } from '../lobby/Lobby';

export const DrawingHandler = (clientState: User, appState: Application, msg: string) => {
    let command = msg.substring(0, CLIENT_MESSAGE_LENGTH);
    switch(command){
        case CLIENT_DRAW_MESSAGES.DRAW_LINE:
        case CLIENT_DRAW_MESSAGES.CHANGE_TOOL:
        case CLIENT_DRAW_MESSAGES.DRAW_DOT:
        let userLobby: Lobby = appState.lobbies.filter((element: Lobby) => element.lobbyCode == clientState.lobby)[0];
        userLobby.users.forEach(
            (user: User) => {
                user.socket.send(msg);
            }
        );
    }
    return {clientState, appState};
}