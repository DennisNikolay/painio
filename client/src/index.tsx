import * as React from "react";
import * as ReactDOM from "react-dom";
import  { CanvasContainer  as GameStage} from "./containers/CanvasContainer";
import { CLIENT_MESSAGES, SERVER_MESSAGES, SERVER_MESSAGE_LENGTH } from './constants/ProtocolMessages';

const server = "ws://localhost:8999";
const lobbyCode = window.location.search.substr(1) || ""; //?aovjoandvoßa

let socket = new WebSocket(server);
socket.onopen= (e: Event) => {
    let payload = JSON.stringify({requested_lobby: lobbyCode});
    socket.send(CLIENT_MESSAGES.CLIENT_LOBBY_STATE_MESSAGES.REQUEST_LOBBY.concat(payload));
    socket.onmessage = (ev: MessageEvent) => {
        console.log(ev.data);
        if(typeof ev.data == 'string'){
            let cmd = ev.data.substring(0, SERVER_MESSAGE_LENGTH);
            if(cmd == SERVER_MESSAGES.SERVER_LOBBY_STATE_MESSAGES.CONNECTION_ACCEPTED){
                let payload = JSON.parse(ev.data.substring(SERVER_MESSAGE_LENGTH));
                let identfier = payload.identfier as number;
                ReactDOM.render( <GameStage width={1280} height={1024} socket={socket} user_id={identfier} />, document.getElementById("example"));
            }
        }
    }
};
