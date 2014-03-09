html5-timepicker
================

HTML5 canvas timepicker, inspired on windows 8 alarms app.
Works in all modern browsers that support html5 canvas

Look at the example.html file for examples

See it working at www.vanoorschot.biz/example.html


use as [name] = new timePicker( [canvas to bind to] , [ options ] )

options array;
hours		 	 -> initial number of hours
minutes		 	 -> initial minutes
drawHandles  	 -> whether to draw handles and enable dragging. If false it is a sort of clock
onTimeChange 	 -> callback on dragging the handles
centerX, centerY -> define a custom center position for the timepicker. The center of the canvas is default
animationStep    -> number of drawings to animate the handler to its position default is 5, so 50ms
drawInterval     -> number of milliseconds between drawing. default is 10ms = 100hz. The real speed depends on the browser and computer.

to set options after creating the timePicker use these functions.
[name].setTime([hours],[minutes]) to set the time
[name].setColor([name of color])  to set a predefined color. [name of color] can be 'pink', 'green', 'orange' or 'blue'. To set it to a custom color, pass an array as [name of color] in the format 
	{
		h: rgba(97,164,0,1), //color for hours <12
		h2: rgba(97,164,0,1), //color for hours >12
		m: rgba(97,164,0,1)   //color for minutes
	}
	
	
to retrieve values at any moment use
[name].getTime() to get the array [hours, minutes]
[name].getTimeStr() to get hours:minutes
