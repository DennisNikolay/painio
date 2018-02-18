/** 
 * Interface for parsed Websocket messages. Defines valid client messages.
 * 
 * !! PAYLOAD SHOULD BE JSON !! 
 * TODO: Is there a valid any-form-of-json-object type in TypeScript?
*/
export interface Message{
    cmd: string,
    payload: any
}