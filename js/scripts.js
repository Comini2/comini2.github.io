$(document).ready(function(){

	var nomes = ["Raízes", "Sistemas", "Interpolação", "Ajuste"];

	for(var i = 0; i<4; i++){
		var id = "T" + (i+2);

		$("#trabalhos").append('<div class="box" id ="'+ id +'"><a href="' + id + '/index.html"><img src=' + id+ '/imgs/1.png><p>' + nomes[i] + '</p></a></div>');
	}
})