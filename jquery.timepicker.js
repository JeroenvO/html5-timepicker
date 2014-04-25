// JavaScript Document

//jquery plugin for html5 timepicker


(function ( $ ) {
	$.fn.timePicker = function( options ) {
		return this.each(function(){
			$(this).data('tp', new timePicker(this, options));
		});
	};
}( jQuery ));