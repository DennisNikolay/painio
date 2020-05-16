export const SERVER_MESSAGE_LENGTH = 3;

export const SERVER_LOBBY_STATE_MESSAGES = {
    "CONNECTION_ACCEPTED": "CON",
    "PING": "PIN",
    "NEW_USER": "NUS",
};


export const SERVER_ERROR_MESSAGES = {
    "PROTOCOL_ERROR": (error: string) => "PRE".concat(
        JSON.stringify(
            {"error": error}
        )
    ),
}

export const SERVER_DRAW_MESSAGES = {
    "DRAW_LINE": "LIN",
    "DRAW_DOT": "DOT",
    "CHANGE_TOOL": "CHT",
}

export const SERVER_MESSAGES = {
    SERVER_LOBBY_STATE_MESSAGES,
    SERVER_DRAW_MESSAGES
}


export default SERVER_MESSAGES;
