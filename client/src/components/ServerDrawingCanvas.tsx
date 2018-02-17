import * as React from "react";
import { SERVER_MESSAGES, SERVER_MESSAGE_LENGTH } from '../constants/ProtocolMessages';
import { SERVER_DRAW_MESSAGES } from "../../../server/src/constants/ServerToClientMessages";

export interface DrawingCanvasProps {
    width: number,
    height: number,
    socket: WebSocket,
    user: {identifier: number}
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

    protected canvas: (HTMLCanvasElement | null) = null; 

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
        this.props.socket.onmessage = (msg: MessageEvent) => {
            if(typeof msg.data == "string" && this.canvas != null){
                let cmd = msg.data.substring(0, SERVER_MESSAGE_LENGTH);
                if([SERVER_DRAW_MESSAGES.CHANGE_TOOL, SERVER_DRAW_MESSAGES.DRAW_DOT, SERVER_DRAW_MESSAGES.DRAW_LINE].indexOf(cmd) != -1){
                    let payload = JSON.parse(msg.data.substring(SERVER_MESSAGE_LENGTH));
                    let context = this.canvas.getContext("2d");
                    if(context == null) throw new DOMException();
                    let drawTool = this.state.drawTools.find((tools) => tools.user == payload.user);
                    if(drawTool == null) throw new DOMException("INVALID MESSAGE");
                    switch(cmd){
                        case SERVER_MESSAGES.SERVER_DRAW_MESSAGES.DRAW_DOT:
                            switch(drawTool.type){
                                case "RECTANGULAR":
                                    context.fillRect(payload.x, payload.y, payload.thickness/2, payload.thickness/2);
                                    break;
                                case "CIRCULAR":
                                    context.arc(payload.x, payload.y, payload.thickness, 0, 2*Math.PI);
                                    break;
                            }
                            break;
                        case SERVER_MESSAGES.SERVER_DRAW_MESSAGES.DRAW_LINE:
                            context.beginPath(); 
                            context.moveTo(payload.p.x, payload.p.y);
                            context.lineTo(payload.q.x, payload.q.y);
                            context.stroke();
                            break;
                        case SERVER_MESSAGES.SERVER_DRAW_MESSAGES.CHANGE_TOOL:
                                let newDrawTools = this.state.drawTools.filter((tool) => tool.user == payload.user).map((tool) => payload);
                                this.setState({drawTools: payload});
                            break;
                    }
                   
                }
            }else{
                //TODO: Error handling
            }
        }
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