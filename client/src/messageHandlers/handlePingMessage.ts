import { Message } from '../interfaces/Message';
import { SERVER_MESSAGES, CLIENT_MESSAGES } from '../constants/ProtocolMessages';
import { ServerDrawingCanvas } from '../components/ServerDrawingCanvas';

export const handlePingMessage = (msg: Message, drawingComponent: ServerDrawingCanvas, ) => {
    if(msg.cmd == SERVER_MESSAGES.SERVER_LOBBY_STATE_MESSAGES.PING){
        drawingComponent.props.socket.send(CLIENT_MESSAGES.CLIENT_LOBBY_STATE_MESSAGES.PONG.concat(JSON.stringify({})));
    }
}