import * as React from "react";
import { ClientDrawingCanvas } from "../components/ClientDrawingCanvas";
import { ServerDrawingCanvas } from "../components/ServerDrawingCanvas";
import { messageHandlers } from '../messageHandlers';
import { parseData as parser } from '../socketDataHandlers/parseData';
import { Message } from '../interfaces/Message';

let continueRunning = true;

const onMountBehaviour = (drawingComponent: ServerDrawingCanvas) => {
    drawingComponent.props.socket.onmessage = (msg: MessageEvent) => {
            let message: Message|false = parser(msg.data, drawingComponent.props.socket as any);
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

export const CanvasContainer = (props: {socket: WebSocket, user_id: number, width: number, height: number}) => {
    return (
        <div>
            <ClientDrawingCanvas width={props.width} height={props.height} onMountBehaviour={onMountBehaviour} socket={props.socket} user={{identifier: props.user_id}} />
        </div>
    );
}