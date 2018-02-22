import * as React from "react";
import { SERVER_MESSAGES, SERVER_MESSAGE_LENGTH } from '../constants/ProtocolMessages';
import { SERVER_DRAW_MESSAGES } from "../../../server/src/constants/ServerToClientMessages";


export interface DrawingCanvasProps {
    width: number,
    height: number,
    socket: WebSocket,
    user_id: string,
    drawTools: any,
    onMountBehaviour: (c: ServerDrawingCanvas) => void
}

export interface DrawingCanvasState {
    mouseBtnPressed: boolean,
    drawPoints: {x: number, y:number}[],
    drawTools: {
        id: string, 
        thickness: number,
        color: string,
        type: string,
        user: string,
    }[],
}


export class ServerDrawingCanvas extends React.Component<DrawingCanvasProps, DrawingCanvasState>{

    public canvas: (HTMLCanvasElement | null) = null; 

    constructor(props: any){
        super(props);
        let userId: string = props.user_id;

        this.state = {
            mouseBtnPressed: false,
            drawPoints:[],
            drawTools:this.props.drawTools,                 
        };
    }
    
    componentDidMount(){
        this.props.onMountBehaviour(this);
    }

    render(){
        return (
            <div>
                <canvas
                ref={(canvasElement) => {this.canvas = canvasElement}}
                width={this.props.width}
                height={this.props.height}
                style={{border: "1px solid black"}}
            />
            </div>
        );
    }

}