import * as React from "react";

export interface DrawingCanvasProps {
    width: number,
    height: number,
    socket: WebSocket,
}

export interface DrawingCanvasState {
    mouseBtnPressed: boolean,
}

export class DrawingCanvas extends React.Component<DrawingCanvasProps, DrawingCanvasState>{

    private canvas: (HTMLCanvasElement | null) = null; 

    constructor(props: any){
        super(props);
        this.state = {mouseBtnPressed: false};
    }

    componentDidMount(){
        console.log("canvas mount");
        this.props.socket.onmessage = (msg: MessageEvent) => {
            if(typeof msg.data == 'string' && msg.data.startsWith("DOT")){
                let pointData: {x: number, y:number} = JSON.parse(msg.data.substr(3));
                if(this.canvas != null){
                    let context = this.canvas.getContext("2d");
                    if(context != null){
                        context.fillStyle = "#000000";
                        context.fillRect(pointData.x, pointData.y, 5, 5);
                    }
                }
            }
        }
    }

    render(){
        return (
            <canvas
                ref={(canvasElement) => {this.canvas = canvasElement}}
                width={this.props.width}
                height={this.props.height}
                onMouseDown={
                    (e) => {
                        e.preventDefault();
                        let b : boolean = this.state.mouseBtnPressed;
                        this.setState({mouseBtnPressed: !b})
                     }
                }
                onMouseMove={
                    (e) => {
                        e.preventDefault();
                        if(this.state.mouseBtnPressed)
                            this.props.socket.send("DOT".concat(JSON.stringify({x: e.clientX, y:e.clientY})));
                     }
                }
                style={{border: "1px solid black"}}
            />
        );
    }

}