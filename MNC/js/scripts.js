$(document).ready(function(){

	var nomes = ["Raízes", "Sistemas lineares", "Interpolação", "Ajuste", "Integrais", "Sistemas não-lineares"];

	for(var i = 0; i<6; i++){
		var id = "T" + (i+2);

		$("#trabalhos").append('<div class="box" id ="'+ id +'"><a href="' + id + '/index.html"><img src=' + id+ '/imgs/1.png><p>' + nomes[i] + '</p></a></div>');
	}
})