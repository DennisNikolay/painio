import { User, Application, Message, Lobby, MessageHandler } from "../../interfaces";
import { CLIENT_DRAW_MESSAGES } from '../../constants/ClientToServerMessages';

/**
 * Handles draw line messages, does nothing if not draw line message
 * 
 * @param clientState the current state of the client
 * @param appState the current state of the complete application
 * @param msg the received message
 */
export const handleDrawLineMessage: MessageHandler = (clientState: User, appState: Application, msg: Message) => {
    if(msg.cmd == CLIENT_DRAW_MESSAGES.DRAW_LINE){
        let userLobby: Lobby = appState.lobbies.filter((element: Lobby) => element.lobbyCode == clientState.lobby)[0];
        userLobby.users.forEach(
            (user: User) => user.socket.send(msg.cmd.concat(JSON.stringify(msg.payload)))
        );
    }
    return {clientState, appState};
}