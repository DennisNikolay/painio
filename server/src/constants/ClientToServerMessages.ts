export const CLIENT_MESSAGE_LENGTH = 3;

export const CLIENT_LOBBY_STATE_MESSAGES = {
    "REQUEST_LOBBY": "LOB",
    "PONG": "PON",
};

export const CLIENT_DRAW_MESSAGES = {
    "DRAW_LINE": "LIN",
    "DRAW_DOT": "DOT",
    "CHANGE_TOOL": "CHT",
}

export const CLIENT_MESSAGES = {
    CLIENT_LOBBY_STATE_MESSAGES,
    CLIENT_DRAW_MESSAGES,
}

export default CLIENT_MESSAGES;