$(document).ready(function(){
	$('#stage').on('click', function(e){
		console.log(e);
		var x = e.pageX, y = e.pageY;
		$('#stage').append('<div class="marker"></div>');
		$('.marker').animate({
			top: e.offsetY  + 'px',
			left: e.offsetX  + 'px'
		},0,'swing')
		$('.hero').animate({
			top: e.offsetY   + 'px',
			left: e.offsetX  + 'px'
		},500,'swing')
	})
})