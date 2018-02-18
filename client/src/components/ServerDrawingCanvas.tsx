import * as React from "react";
import { SERVER_MESSAGES, SERVER_MESSAGE_LENGTH } from '../constants/ProtocolMessages';
import { SERVER_DRAW_MESSAGES } from "../../../server/src/constants/ServerToClientMessages";

export interface DrawingCanvasProps {
    width: number,
    height: number,
    socket: WebSocket,
    user: {identifier: number}
    onMountBehaviour: (c: ServerDrawingCanvas) => void
}

export interface DrawingCanvasState {
    mouseBtnPressed: boolean,
    drawPoints: {x: number, y:number}[],
    drawTools: {
        user: number,
        id: string, 
        thickness: number,
        color: string,
        type: string,
    }[],
}

const BRUSH_ID = "BRUSH";
const BUSH_TYPES = {
   RECTANGULAR: "RECTANGULAR",
   CIRCULAR: "CIRCULAR"
};

export class ServerDrawingCanvas extends React.Component<DrawingCanvasProps, DrawingCanvasState>{

    public canvas: (HTMLCanvasElement | null) = null; 

    constructor(props: any){
        super(props);
        let ownDrawTool = 
        {
            user: this.props.user.identifier,
            id: BRUSH_ID,
            thickness: 5,
            color: "#000000",
            type: BUSH_TYPES.RECTANGULAR,
        };
        this.state = {
            mouseBtnPressed: false,
            drawPoints:[],
            drawTools: [ownDrawTool],                 
        };
    }


    componentDidMount(){
        this.props.onMountBehaviour(this);
    }

    render(){
        return (
            <canvas
                ref={(canvasElement) => {this.canvas = canvasElement}}
                width={this.props.width}
                height={this.props.height}
                style={{border: "1px solid black"}}
            />
        );
    }

}