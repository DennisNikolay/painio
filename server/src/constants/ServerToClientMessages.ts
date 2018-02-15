export const SERVER_LOBBY_STATE_MESSAGES = {
    "CONNECTION_ACCEPTED": "CON",

};


export const SERVER_ERROR_MESSAGES = {
    "PROTOCOL_ERROR": (code: number) => "PRE".concat(code.toString()),

}
export const SERVER_ERROR_CODES = {
    "ALREADY_IN_LOBBY" : 100,
    "LOBBY_CODE_LENGTH_INVALID": 101,
}


export const SERVER_MESSAGES = {
    SERVER_LOBBY_STATE_MESSAGES,

}

export default SERVER_MESSAGES;
