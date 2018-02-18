import { Message } from '../interfaces/Message';
import { SERVER_MESSAGES } from '../constants/ProtocolMessages';
import { ServerDrawingCanvas } from '../components/ServerDrawingCanvas';
import { Server } from 'http';

export const handleDrawLineMessage = (msg: Message, drawingComponent: ServerDrawingCanvas) => {
    if(drawingComponent.canvas == null){
        throw new DOMException("Illegal State, canvas should not be null!");
    }
    let context = drawingComponent.canvas.getContext("2d");
    if(context == null){
        throw new DOMException("Illegal State, 2d context should not be null!");
    }
    if(msg.cmd == SERVER_MESSAGES.SERVER_DRAW_MESSAGES.DRAW_LINE){
        context.beginPath(); 
        context.moveTo(msg.payload.p.x, msg.payload.p.y);
        context.lineTo(msg.payload.q.x, msg.payload.q.y);
        context.stroke();
    }

}