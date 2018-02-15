
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


canvas.onmousedown = function(e){
	var posX = e.pageX - this.offsetLeft;
	var posY = e.pageY - this.offsetTop;
	//TODO: More tools like fill, erase etc.
	if(mode==='paint'){
		paint = true;
		addClick(posX,posY);
		startRecord();
		redraw();
	}else{
		// call fill function
	}
};


canvas.onmousemove = function(e){
	if(paint){
		addClick(e.pageX-this.offsetLeft,e.pageY-this.offsetTop,true);
		redraw();
	}
};

canvas.onmouseleave = function(e){
	if(paint){
		soptRecord();
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
	temp = xList.length;

}

function stopRecord(){
	strokeList.push(xList.length - temp +1);
	var str=""
	for(var i=0;i< strokeList.length;i++){
	str += " " + strokeList[i] + "\n";
	}
	console.log(str);

}

function addClick(x,y,dragging){
	xList.push(x);
	yList.push(y);
	dList.push(dragging);
	thickList.push(thickness);
}

function redraw(){
	context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
  
	  context.strokeStyle = "#b12ddf";
	  context.lineJoin = "round";
	  context.lineWidth = 5;
			
	  for(var i=0; i < xList.length; i++) {		
		  context.lineWidth = thickList[i];
	    context.beginPath();
	    if(dList[i] && i){
	      context.moveTo(xList[i-1], yList[i-1]);
	     }else{
	       context.moveTo(xList[i]-1, yList[i]);
	     }
	     context.lineTo(xList[i], yList[i]);
	     context.closePath();
	     context.stroke();
	  }
}

clearButton.onclick = function (){
	xList = [];
	yList = [];
	dList = [];
	strokeList = [];
	redraw();
};


backButton.onclick = function (){
	console.log("lenght->" + strokeList.length);
	var cut = strokeList[strokeList.length-1];
	console.log("back ->" + cut);
	xList.splice(xList.length-cut,xList.length);
	yList.splice(yList.length-cut,yList.length);
	dList.splice(dList.length-cut,dList.length);
	strokeList.splice(strokeList.length-1,strokeList.length);
	cut=0;
    var str=""
    for(var i=0;i< strokeList.length;i++){
        str += " " + strokeList[i] + "\n";
    }
    console.log(str);
	redraw();
	
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









