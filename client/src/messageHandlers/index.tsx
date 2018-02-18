import { Message } from "../interfaces/Message";
import { ServerDrawingCanvas } from "../components/ServerDrawingCanvas";
import { handleChangeToolMessage } from './handleChangeToolMessage';
import { handleDrawDotMessage } from './handleDrawDotMessage';
import { handleDrawLineMessage } from './handleDrawLineMessage';
import { handlePingMessage } from './handlePingMessage'

export const messageHandlers:((msg: Message, drawingComponent: ServerDrawingCanvas) =>void)[] = [
    handleChangeToolMessage,
    handleDrawDotMessage,
    handleDrawLineMessage,
    handlePingMessage
]