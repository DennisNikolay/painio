import { User } from "../User";
import { Application } from "../Application";
import { CLIENT_MESSAGE_LENGTH, CLIENT_DRAW_MESSAGES } from '../constants/ClientToServerMessages';
import { SERVER_MESSAGES } from '../constants/ServerToClientMessages';
import { Lobby } from '../lobby/Lobby';

export const DrawingHandler = (clientState: User, appState: Application, msg: string) => {
    let command = msg.substring(0, CLIENT_MESSAGE_LENGTH);
    switch(command){
        case CLIENT_DRAW_MESSAGES.DRAW_LINE:
        case CLIENT_DRAW_MESSAGES.DRAW_DOT:
            let userLobby: Lobby = appState.lobbies.filter((element: Lobby) => element.lobbyCode == clientState.lobby)[0];
            userLobby.users.forEach(
                (user: User) => {
                    user.socket.send(msg);
                }
            );
            break;
        case CLIENT_DRAW_MESSAGES.CHANGE_TOOL:
            let payload = JSON.parse(msg.substring(CLIENT_MESSAGE_LENGTH));
            clientState.drawTool = payload;
            let ownLobby = appState.lobbies.filter((element: Lobby) => element.lobbyCode == clientState.lobby)[0];
            payload.user = clientState.identifier;
            ownLobby.users.filter((user) => user.identifier != clientState.identifier).forEach(
                (user: User) => {
                    user.socket.send(SERVER_MESSAGES.SERVER_DRAW_MESSAGES.CHANGE_TOOL.concat(JSON.stringify(payload)));
                }
            );

            break;
    }
    return {clientState, appState};
}