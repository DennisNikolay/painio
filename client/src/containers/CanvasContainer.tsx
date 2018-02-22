import * as React from "react";
import { ClientDrawingCanvas } from "../components/ClientDrawingCanvas";
import { ServerDrawingCanvas } from "../components/ServerDrawingCanvas";
import { messageHandlers } from '../messageHandlers';
import { parseData as parser } from '../socketDataHandlers/parseData';
import { Message } from '../interfaces/Message';
import { ColorResult } from "react-color";

let continueRunning = true;

const onMountBehaviour = (drawingComponent: ServerDrawingCanvas) => {
    drawingComponent.props.socket.onmessage = (msg: MessageEvent) => {
            let message: Message|false = parser(msg.data, drawingComponent.props.socket as any);
            //console.log(message);
            if(message == false ){
                continueRunning = false;
            }
            messageHandlers.forEach((handler) => {
                if(continueRunning){
                    handler(message as Message, drawingComponent);
                }
            });
    }
}


export const CanvasContainer = (props: {socket: WebSocket, user_id: string, width: number, height: number, users: any}) => {
    let drawTools = props.users.map(
        (user: any) => {
            return { ...user.drawTool, user: user.identifier};
        }
    );
    return (
        <div>
            <ClientDrawingCanvas width={props.width} height={props.height} onMountBehaviour={onMountBehaviour} socket={props.socket} user_id={props.user_id} drawTools={drawTools} />
        </div>
    );
}