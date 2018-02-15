
var paint = false;

var xList=[];			// List of x- coordinates
var yList=[];			// List of y- coordinates
var dList=[];			// List of Dragging- booleans  ---> Ob der Stift erst ansetzt oder eine linie zieht
var thickList = [];		// List of Thickness
var strokeList=[];		// List of strokes

var temp=0;				// Placeholder variable for splitting the x/y/thick-/stroke- List when using the 'back-button'

var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");


var mode = 'paint';			//standard-mode whend startet. it indicates that you are using the draw-tool

// several buttons
var clearButton = document.getElementById("button");
var backButton = document.getElementById("strz");
var slider = document.getElementById("myRange");
var paintBox = document.getElementById("paint");
var fillBox = document.getElementById("fill");

var thickness = 5;

var canvasData;
canvasData = {'xList': [], 'yList': [], 'dList': [], 'thickList': [], 'strokeList': []};


/*
* TODO:
* */


canvas.onmousedown = function(e){
	var posX = e.pageX - this.offsetLeft;
	var posY = e.pageY - this.offsetTop;
	//TODO: More tools like fill, erase etc.
	if(mode==='paint'){
		paint = true;
		addClick(posX,posY);
		startRecord();
		redraw(canvasData);
	}else{
		// call fill function
	}
};


canvas.onmousemove = function(e){
	if(paint){
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
	temp = canvasData.xList.length;

}

function stopRecord(){
	canvasData.strokeList.push(canvasData.xList.length - temp +1);
	var str=""
	for(var i=0;i< canvasData.strokeList.length;i++){
	str += " " + canvasData.strokeList[i] + "\n";
	}
	console.log(str);

}

function addClick(x,y,dragging){
	canvasData.xList.push(x);
	canvasData.yList.push(y);
	canvasData.dList.push(dragging);
	canvasData.thickList.push(thickness);
}


/* wird von Server Aufgerufen */
function redraw(data){
	context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
  
	  context.strokeStyle = "#b12ddf";
	  context.lineJoin = "round";
	  context.lineWidth = 5;

    for(var i=0; i < data.xList.length; i++) {
        context.lineWidth = data.thickList[i];
        context.beginPath();
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

slider.oninput= function () {
	thickness = this.value;
};

paintBox.onclick = function (e){
	mode='paint';
};
fillBox.onclick = function (e) {
	mode = 'fill';
};









