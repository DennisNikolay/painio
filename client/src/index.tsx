import * as React from "react";
import * as ReactDOM from "react-dom";
import { DrawingCanvas } from "./components/DrawingCanvas";

const server = "ws://localhost:8999";
const lobbyCode = window.location.search.substr(1) || "";

let socket = new WebSocket(server);
socket.onopen=(e: Event) => socket.send("LOB".concat(lobbyCode));
ReactDOM.render( <DrawingCanvas width={1280} height={1024} socket={socket} />, document.getElementById("example") );