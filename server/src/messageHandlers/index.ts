import { User } from '../interfaces/User';
import { Message } from '../interfaces/Message';
import { Application } from "../interfaces/Application";
import { handleChangeToolMessage } from './draw/handleChangeToolMessage';
import { handleDrawLineMessage } from './draw/handleDrawLineMessage';
import { handleLobbyMessage } from './lobby/handleLobbyMessage';


export const messageHandlers:((clientState: User, appState: Application, msg: Message) => false | { clientState: User; appState: Application; })[] = [
   handleLobbyMessage,
   handleDrawLineMessage,
   handleChangeToolMessage,
]