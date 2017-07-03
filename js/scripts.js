$(document).ready(function(){

	for(var i = 0; i<4; i++){
		var id = "T" + (i+2);

		console.log(id);
		$("#trabalhos").append('<div class="col-sm-3 box"><a href="' + id + '/index.html"><img src=' + id+ '/imgs/1.png></a></div>');
	}
})