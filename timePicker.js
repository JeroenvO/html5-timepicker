// Jeroen van Oorschot 2014

//draw function to do all the drawing. If drawHandles is false, it is just a clock
timePicker.prototype.drawTime = function(drawHandles){
	if(this.changed){
		//////drawing
		this.ctx.save();
		//clear canvas first
		this.ctx.clearRect ( 0 , 0 , this.canvas.width , this.canvas.height );
		//square as background
		this.ctx.beginPath();
		this.ctx.rect(0,0,2*this.centerX , 2*this.centerY);
		this.ctx.closePath();
		this.ctx.fillStyle = 'rgba(29,29,29,1)';
		this.ctx.fill();
		
		//draw around center
		this.ctx.translate(this.centerX, this.centerY);
		
		//background outer border, below minutes handle
		/*
		this.ctx.beginPath();
		this.ctx.arc(this.centerX, this.centerY, this.scale*5/4, 0, 2*Math.PI, false);
		this.ctx.closePath();
		this.ctx.fillStyle = 'rgba(240,240,240,1)';
		this.ctx.fill();
		*/
		//dark background below minutes
		this.ctx.beginPath();
		this.ctx.arc(0,0, this.scale*4, 0, 2*Math.PI, false);
		this.ctx.closePath();
		this.ctx.fillStyle = 'rgba(22,22,22,1)';
		this.ctx.fill();
		//dark background below hours
		this.ctx.beginPath();
		this.ctx.arc(0,0, this.scale*3, 0, 2*Math.PI, false);
		this.ctx.closePath();
		this.ctx.fillStyle = 'rgba(14,14,14,1)';
		this.ctx.fill();
		if(this.hSnd){ //draw background for second round for hours
			this.ctx.beginPath();
			this.ctx.arc(0,0, this.scale*3, 0, 2*Math.PI, false);
			this.ctx.closePath();
			this.ctx.fillStyle = this.hColor;
			this.ctx.fill();
		}
		//draw inside
		this.ctx.beginPath();
		this.ctx.arc(0,0, this.scale*2, 0, 2*Math.PI, false);
		this.ctx.closePath();
		this.ctx.fillStyle = 'rgba(10,10,10,1)';
		this.ctx.fill();
		//general for hours and minutes
		this.ctx.lineWidth = this.scale;
		//draw outer circle for minutes
		this.ctx.beginPath();
		this.ctx.strokeStyle=this.mColor;
		this.ctx.arc(0,0, this.scale*3+this.scale/2, -0.5*Math.PI, this.mA, false);
		this.ctx.stroke();
		this.ctx.closePath();
		//draw inner circle for hours
		this.ctx.beginPath();
		this.ctx.strokeStyle=this.hSnd?this.hColor2:this.hColor;
		this.ctx.arc(0,0, this.scale*2+this.scale/2, -0.5*Math.PI, this.hA, false);
		this.ctx.stroke();
		this.ctx.closePath();
		//this.ctx.globalAlpha=1;
		//draw time in the center
		var fontSize = this.scale*4/3;
		this.ctx.font= fontSize + "px Segoe UI light";
		var text = this.getTimeStr();
		this.ctx.textAlign = 'center';
		this.ctx.fillStyle = 'white';
		this.ctx.fillText(text,0,0+this.scale*2/5);
		if(drawHandles){
			handlesPos = this.getHandlers();
			//set canvas origin for minute
			this.ctx.save();
			this.ctx.rotate(this.mA);
			this.ctx.translate(this.scale*3+this.scale,0); //go to handle location
			//draw triangle for minute
			this.drawHandle('m');
			//set canvas origin
			this.ctx.restore(); //restore the canvas so that origin is in center of image
			this.ctx.rotate(this.hA);
			this.ctx.translate(this.scale*2+this.scale,0); //go to handle location
			this.drawHandle('h');
			}	
		this.ctx.restore();
	}
	this.changed = false;
}
timePicker.prototype.drawHandle =  function(handle){
//draw triangle
	this.ctx.beginPath();
	this.ctx.fillStyle='white'
	this.ctx.moveTo(this.scale/20,-this.scale*3/20);
	this.ctx.lineTo(this.scale/20,this.scale*3/20);
	this.ctx.lineTo(-this.scale/10,0);
	this.ctx.fill();
	this.ctx.closePath();
	
	this.ctx.translate(this.scale/2-this.scale/20,0);
	//draw handle
	this.ctx.beginPath();
	this.ctx.arc(0,0, this.scale/2-this.scale/10, 0, 2*Math.PI, false);
	this.ctx.closePath();
	this.ctx.strokeStyle='white'
	this.ctx.lineWidth = this.scale/10;
	this.ctx.stroke();
	this.ctx.fillStyle = (this.selected===handle)?'white':'rgba(38,38,38,1)';
	this.ctx.fill();
}

//return the position of the mouse relative to the canvas
timePicker.prototype.getMousePos = function(evt) {
	var rect = this.canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}

//check whether a given position (of the mouse) in xMouse and yMouse falls inside one of the handlers.
//used for checked whether handle is selected
timePicker.prototype.contains = function(xMouse, yMouse){
	handlersPos = this.getHandlers();
	if((Math.pow(handlersPos.xh-xMouse,2)+Math.pow(handlersPos.yh-yMouse,2))  <= this.scale/2*this.scale/2 )
		return 'h';
	if((Math.pow(handlersPos.xm-xMouse,2)+Math.pow(handlersPos.ym-yMouse,2)) <= this.scale/2*this.scale/2 )
		return 'm';
	else
		return false;
}


//return hour and minutes angle [0:2PI] from the [0:60] and [0:24] values
function getAngle(h, m){
	return {
		h : ((h%12)/12*2-0.5)*Math.PI,
		m : ((m%60)/60*2-0.5)*Math.PI,
		s : h>12?true:false
	};
}
timePicker.prototype.setWidth = function(w,h,centerX,centerY,scale){
	this.canvas.width =w;
	this.canvas.heigth = h;
	this.centerX = centerX || w/2;
	this.centerY = centerY || h/2;
	this.scale = scale || Math.min(w,h)/10; //outer radius of all circles
	this.changed = true;
}
//animate a handler to a given angle
timePicker.prototype.animate = function(handler,endHours,endMinutes){
	this.tA = this[handler+'A']; //current angle of handler that should animate
	//move either to closest by position or to hA, mA position
	var endAngle;
	if((typeof endHours === 'number')&&(typeof endMinutes === 'number')){ //settime
		endAngle = getAngle(endHours,endMinutes)[handler];
	}else{
		endAngle = getAngle(this.getTime().h, this.getTime().m)[handler]; //angle where the handler should go to after a handler release
	}
	if(endAngle==-1/2*Math.PI&&this.tA>Math.PI){endAngle+=Math.PI*2} //if end is on top, make sure that the handle does not animate a full round
	var step = (endAngle-this.tA)/this.animationStep; //step size for the animation
	var x = 0;
	var timePicker = this; //store this to use in setinterval function

    var intervalID = window.setInterval(function () {
		timePicker[handler+'A'] += step;
		timePicker[handler+'A'] %= 2*Math.PI; // make sure angle does not become too large
		//StimePicker.setSnd();
		timePicker.changed = true;
        if (++x === timePicker.animationStep) {
        	window.clearInterval(intervalID);
        }
		//console.log('animating: '+handler+timePicker.animationStep);
    }, timePicker.drawInterval);
	
}
//returns the centers of the handles for the minutes and hours.
//Used to draw the handles and to check whether they are selected
timePicker.prototype.getHandlers = function(draw){
/*  this.scale*0.5 outside of inner time circle
	this.scale*0.75 outside of hours oocircle
	this.scale*3/8 width of arc + diameter of handle
	*/
	return {
		xh : this.centerX+Math.cos(this.hA)*(this.scale*2+this.scale*3/2),
		yh : this.centerY+Math.sin(this.hA)*(this.scale*2+this.scale*3/2),
		xm : this.centerX+Math.cos(this.mA)*(this.scale*3+this.scale*3/2),
		ym : this.centerY+Math.sin(this.mA)*(this.scale*3+this.scale*3/2)
	};
}

//return an angle converted to time. max is the maximum value of the time, this is 24 or 60
timePicker.prototype.getTime = function(){
	var offset = this.hSnd?12:0;
	return {
		h : (Math.round((this.hA+0.5*Math.PI)*6/Math.PI) + offset)%24,
		m : (Math.round((this.mA+0.5*Math.PI)*30/Math.PI))%60
	}
}

//return the string representing the time
timePicker.prototype.getTimeStr = function(){
	var t = this.getTime()
	var zero = t.m.toString().length==1?'0':'';;
	var timeStr = (t.h + ':' + zero + t.m.toString());
//	if(this.onTimeChange){this.onTimeChange()}
	return timeStr;
}

//set the timePicker to a given time
timePicker.prototype.setTime = function(hours, minutes){
	this.hSnd = hours>12?true:false;
	//console.log('settime'+hours+minutes);
	this.animate('h',hours,minutes);
	this.animate('m',hours,minutes);
}

//set whether 12 or 24 hour after mousemove
timePicker.prototype.setSnd = function(my){
		//change 
	var p = this.prevH;
	var a = this.hA+0.5*Math.PI;
	if(((p>=0&&a>Math.PI&&p<Math.PI)||(a>=0&&p>Math.PI&&a<Math.PI))&&(my<this.centerY)){ //when mouse around x=0 (top) point, and snd has not yet changed
		this.hSnd = !this.hSnd;
	}
	//store angle to compare later
	this.prevH = a;
}

timePicker.prototype.setColor = function(color){
	switch(color){
		case 'pink': color = {m:'rgba(255,42,126,1)',h:'rgba(177,0,55,1)',h2:'rgba(124,0,39,1)'};
		break;
		case 'green': color = {m:'rgba(97,164,0,1)',h:'rgba(0,74,0,1)',h2:'rgba(0,52,0,1)'};
		break;
		case 'orange': color = {m:'rgba(255,99,0,1)',h:'rgba(128,0,0,1)',h2:'rgba(90,0,0,1)'};
		break;
		case 'blue': color = {m:'rgba(0,164,164,1)',h:'rgba(0,69,87,1)',h2:'rgba(0,48,61,1)'};
		break;
	}
	//colors of arcs
	this.hColor = color.h;
	this.mColor = color.m;
	this.hColor2 = color.h2;
	this.changed = true;
}
//function object for each canvas, for each timePicker
//contains all variables for a timepicker like scale and time.
function timePicker(canvas,opts){
	//init
	this.canvas = canvas;
	this.ctx = canvas.getContext('2d');            //get the drawable part of the canvas
	var timePicker = this;                         //store (this) class in variable, so events can use (this) as well
	this.hA = 0;
	this.mA = 0;
	this.tA = 0; //temporary angle of the last moved handler, used to animate handlers on release
	this.changed = true;
	
	//options
	this.setWidth(canvas.width,canvas.height,opts.centerX || false, opts.centerY || false);
	this.drawHandles = (typeof opts.drawHandles === 'undefined')?true:false; //draw handles on the timepicker. If false, it is just a clock	
	if(opts.color)this.setColor(opts.color);
	this.animationStep = opts.animationStep || 5; 	//number of steps in handle animation
	this.drawInterval = opts.drawInterval || 10;	//time between drawing the canvas in ms
	this.onTimeChange = opts.onTimeChange || false; //callback function
	this.setTime(opts.hours, opts.minutes);
	
	//start the drawing
	setInterval(function() { timePicker.drawTime(timePicker.drawHandles); }, timePicker.drawInterval);
	
	//if the mouse is down, check whether it is on any of the handles
	canvas.addEventListener('mousedown', function(e) {
		//console.log(e);
		if(timePicker.drawHandles){ //only enable select-handle if there are handles
			var mouse = timePicker.getMousePos(e);
			timePicker.selected = timePicker.contains(mouse.x,mouse.y); //this functions sets timePicker.selected
			timePicker.changed = true; //redraw to show selected handle on click, not only on draw
		}
	});
	//if the mouse if moved AND a handler is selected, move the handler and calculate the new time
	canvas.addEventListener('mousemove', function(e) {
		if(timePicker.selected){
			if(timePicker.onTimeChange){timePicker.onTimeChange();} //function executed when the handles are changed
			//get mouse positions for moving
			var mouse = timePicker.getMousePos(e);
			var mx = mouse.x;
			var my = mouse.y;
			//calculate the rotate angle from the mouse X and Y
			var angle = Math.atan((my-timePicker.centerY)/(mx-timePicker.centerX));
			if(mx<timePicker.centerX){angle=angle+Math.PI};
					//change 
			if(timePicker.selected=='h'){timePicker.setSnd(my)};

			//set the angle right
			timePicker[timePicker.selected+'A'] = angle;
			//the canvas changed, if this is true, it will be redrawn
			timePicker.changed = true;
		}
	});
	//stop the selection when the mouse is released.
	//bind this one to window to also stop the selection if mouse is released outside the canvas area.
	window.addEventListener('mouseup', function(e) { 
		if(timePicker.selected){
			timePicker.animate(timePicker.selected,true); //animate handlers to position
			timePicker.selected = false; // which handle is moving is now stored, so handle can be deselected
			timePicker.changed = true;
			}
	});
}
