export const LOBBY_CODE_LENGTH = 20;
export const LOBBY_MAX_PLAYER = 10;
export const LOBBY_MIN_PLAYER = 1;
import { User } from "../User";

export interface Lobby{
    lobbyCode: string,
    users: User[],
}