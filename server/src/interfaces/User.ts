import { ErrorSafeWebSocket as WebSocket } from '../socketDataHandlers/ErrorSafeWebSocket';
export interface User{
    lobby: string,
    socket: WebSocket,
    drawTool: any,
    identifier: number,
}