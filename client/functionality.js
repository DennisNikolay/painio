var paint = false;

/*
var xList=[];			// List of x- coordinates
var yList=[];			// List of y- coordinates
var dList=[];			// List of Dragging- booleans  ---> Ob der Stift erst ansetzt oder eine linie zieht
var thickList = [];		// List of Thickness
var strokeList=[];		// List of strokes

var frameCount=0;				// Placeholder variable for splitting the x/y/thick-/stroke- List when using the 'back-button'

*/
var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");


var mode = 'paint';			//standard-mode whend startet. it indicates that you are using the draw-tool

// several buttons
var clearButton = document.getElementById("button");
var backButton = document.getElementById("strz");
var eraseButton = document.getElementById("erase");
var paintButton = document.getElementById("paint");
var fillButton = document.getElementById("fill");
var smallButton = document.getElementById('small');
var normalButton = document.getElementById('normal');
var bigButton = document.getElementById('big');


var thickness = 3;
var color='#000000';

var canvasData;
canvasData = {'xList': [], 'yList': [], 'dList': [], 'thickList': [], 'color':[], 'strokeList': [] , 'frameCount':0};


/*
* TODO:
* */


canvas.onmousedown = function(e){
	var posX = e.pageX - this.offsetLeft;
	var posY = e.pageY - this.offsetTop;
	//TODO: More tools like fill, erase etc.
	paint=true;

	switch(mode){
		case 'erase':
		case 'paint':
            addClick(posX,posY);
            startRecord();
            redraw(canvasData);
            break;

		case 'fill':
			console.log(fill);
			break;
		default:

			//alert('onmousedown-> mode error');
			alert(mode);

	}

};


canvas.onmousemove = function(e){
	if((mode=='paint' || mode=='erase')&&paint){
		addClick(e.pageX-this.offsetLeft,e.pageY-this.offsetTop,true);

		redraw(canvasData);
	}
};

canvas.onmouseleave = function(e){
	if(paint){
		stopRecord();
	}
	paint= false;

};

canvas.onmouseup = function(e){
	if(paint){
		stopRecord();
	}
	paint=false;

};

function startRecord(){
	canvasData.frameCount = canvasData.xList.length;

}

function stopRecord(){
	canvasData.strokeList.push(canvasData.xList.length - canvasData.frameCount +1);


}

function addClick(x,y,dragging){
	canvasData.xList.push(x);
	canvasData.yList.push(y);
	canvasData.dList.push(dragging);
	canvasData.thickList.push(thickness);
	if(mode=='paint'){
		canvasData.color.push(color);
	}else{
		canvasData.color.push('#FFFFFF');
	}
}


/* wird von Server Aufgerufen */
function redraw(data){
	context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
  

	  context.lineJoin = "round";
	  context.lineWidth = 5;

    for(var i=0; i < data.xList.length; i++) {
        context.lineWidth = data.thickList[i];
        context.beginPath();
        context.strokeStyle = data.color[i];
        if(data.dList[i] && i){
            context.moveTo(data.xList[i-1], data.yList[i-1]);
        }else{
            context.moveTo(data.xList[i]-1, data.yList[i]);
        }
        context.lineTo(data.xList[i], data.yList[i]);
        context.closePath();
        context.stroke();
    }
}

clearButton.onclick = function (){
	canvasData.xList = [];
	canvasData.yList = [];
	canvasData.dList = [];
	canvasData.strokeList = [];

	/* An Server Senden */
	redraw(canvasData);
};


backButton.onclick = function (){
	var cut = canvasData.strokeList[canvasData.strokeList.length-1];
    canvasData.xList.splice(canvasData.xList.length-cut,canvasData.xList.length);
	canvasData.yList.splice(canvasData.yList.length-cut,canvasData.yList.length);
	canvasData.dList.splice(canvasData.dList.length-cut,canvasData.dList.length);
	canvasData.strokeList.splice(canvasData.strokeList.length-1,canvasData.strokeList.length);

	/* An Server senden.*/
	redraw(canvasData);
	
};



smallButton.onclick= function(){
	thickness = 3;
	console.log('ha');
};
normalButton.onclick= function() {
	thickness = 7;
};
bigButton.onclick = function(){
	thickness= 15;
};

paintButton.onclick = function (){
	mode='paint';
};
fillButton.onclick = function () {
	mode = 'fill';
};
eraseButton.onclick = function(){
	mode='erase';
};









