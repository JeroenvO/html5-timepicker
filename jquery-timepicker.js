// JavaScript Document

//jquery plugin for html5 timepicker


(function ( $ ) {
	$.fn.timepicker = function( options ) {
		return this.each(function(){
			var timePicker1 = new timePicker(this, options);
		});
	};
}( jQuery ));