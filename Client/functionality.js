
var paint = false;

var xList=new Array();
var yList=new Array();
var dList=new Array();
var strokeList=new Array();
var thickList = new Array();

var temp=0;

var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");

var r=255;
var g=255;
var b=255;
var a=255;

var mode = 'paint';

var clearButton = document.getElementById("button");
var backButton = document.getElementById("strz");
var slider = document.getElementById("myRange");
var paintBox = document.getElementById("paint");
var fillBox = document.getElementById("fill");

var thickness = 5;


canvas.onmousedown = function(e){
	var posX = e.pageX - this.offsetLeft;
	var posY = e.pageY - this.offsetTop;
	if(mode=='paint'){
		paint = true;
		addClick(posX,posY);
		startRecord();
		redraw();
	}else{
		fill(posX,posY);
	}
}
function fill(x,y){

    var p = context.getImageData(x, y, 1, 1).data; 
	var col= (255,255,255);
	context.putImageData(col,0,0);
	redraw();
	
}

canvas.onmousemove = function(e){
	if(paint){
		addClick(e.pageX-this.offsetLeft,e.pageY-this.offsetTop,true);
		redraw();
	}
}

canvas.onmouseleave = function(e){
	if(paint){
		soptRecord();
	}
	paint= false;

}

canvas.onmouseup = function(e){
	if(paint){
		stopRecord();
	}
	paint=false;

}

function startRecord(){
	temp = xList.length;
	console.log(temp);
}

function stopRecord(){
	strokeList.push(xList.length - temp);
	console.log("ho");
}

function addClick(x,y,dragging){
	xList.push(x);
	yList.push(y);
	dList.push(dragging);
	thickList.push(thickness);
}

function redraw(){
	context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
  
	  context.strokeStyle = "#df4b26";
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
	xList = new Array();
	yList = new Array();
	dList = new Array();
	strokeList = new Array();
	redraw();
}


backButton.onclick = function (){
	var cut = strokeList[0];
	
	xList.splice(xList.length-cut,xList.length);
	yList.splice(yList.length-cut,yList.length);
	dList.splice(dList.length-cut,dList.length);
	strokeList.splice(0,1);
	redraw();
	
}

slider.oninput= function () {
	thickness = this.value;
}

paintBox.onclick = function (e){
	mode='paint';
}
fillBox.onclick = function (e) {
	mode = 'fill';
}









