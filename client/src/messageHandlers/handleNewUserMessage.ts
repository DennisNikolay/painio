import { Message } from '../interfaces/Message';
import { SERVER_MESSAGES } from '../constants/ProtocolMessages';
import { ServerDrawingCanvas } from '../components/ServerDrawingCanvas';

export const handleNewUserMessage = (msg: Message, drawingComponent: ServerDrawingCanvas, ) => {
    if(msg.cmd == SERVER_MESSAGES.SERVER_LOBBY_STATE_MESSAGES.NEW_USER){
        drawingComponent.state.drawTools.push(
            {
                ...msg.payload.drawTool,
                user: msg.payload.identifier
            }
        );
    }
}