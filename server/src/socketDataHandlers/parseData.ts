import { CLIENT_MESSAGE_LENGTH } from '../constants/ClientToServerMessages';
import { SERVER_ERROR_MESSAGES } from '../constants/ServerToClientMessages';
import * as WebSocket from 'ws';
import { Message } from '../interfaces';


/**
 * Parses data that is recieved from a client. 
 * Checks if the data is a valid message (type CMD{JSON_PAYLOAD})
 * 
 * @param message the raw data received from the socket
 * @param connection the websocket the user is connected to
 * @returns {cmd: string, payload: JSON-Object} | false if invalid message
 */
export const parseData: ((message: string, connection: WebSocket) =>(false|Message)) = (message: string, connection: WebSocket) => {
    if(message.length < CLIENT_MESSAGE_LENGTH){
        connection.send(SERVER_ERROR_MESSAGES.PROTOCOL_ERROR("Message length invalid!"));
        connection.close();
    }
    let cmd = message.substring(0, CLIENT_MESSAGE_LENGTH);
    let payload = message.substring(3);
    try{
        let jsonPayload = JSON.parse(payload);
        let result = JSON.parse(JSON.stringify({cmd, payload: jsonPayload}));
        return (result);
    }catch(e){
        connection.send(SERVER_ERROR_MESSAGES.PROTOCOL_ERROR("Invalid payload!"));
        connection.close();
        return false;
    }
}