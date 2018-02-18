import { Message } from '../interfaces/Message';
import { SERVER_MESSAGES } from '../constants/ProtocolMessages';
import { ServerDrawingCanvas } from '../components/ServerDrawingCanvas';
import { Server } from 'http';

export const handleDrawDotMessage = (msg: Message, drawingComponent: ServerDrawingCanvas) => {
    if(drawingComponent.canvas == null){
        throw new DOMException("Illegal State, canvas should not be null!");
    }
    let context = drawingComponent.canvas.getContext("2d");
    if(context == null){
        throw new DOMException("Illegal State, 2d context should not be null!");
    }
    if(msg.cmd == SERVER_MESSAGES.SERVER_DRAW_MESSAGES.DRAW_DOT){
        let drawTool = drawingComponent.state.drawTools.find((tools) => tools.user == msg.payload.user);
        if(drawTool == undefined){
            throw new DOMException("Illegal State, draw tool should be found!");
        }
        switch(drawTool.type){
            case "RECTANGULAR":
                context.fillRect(msg.payload.x, msg.payload.y, msg.payload.thickness/2, msg.payload.thickness/2);
                break;
            case "CIRCULAR":
                context.arc(msg.payload.x, msg.payload.y, msg.payload.thickness, 0, 2*Math.PI);
                break;
        }
    }
}