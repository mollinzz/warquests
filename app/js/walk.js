$(document).ready(function(){
	$('#stage').on('click', function(e){
		console.log(e);
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