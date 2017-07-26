$(document).ready(function(){

	var n;
	var x = {x1: 0, x2: 0, x3: 0, x4: 0, x5: 0};
	console.log(x["x"+1]);
	

	$("#n").change(function(){

		n = !isNaN(parseInt($("#n").val())) ? parseInt($("#n").val()) : 0;

		if(n>5){
			n = 5;
			$("#n").val(5);
		}


		$("#funcoes").empty();

		for(var i = 0; i<n; i++)
			$("#funcoes").append('<label for="f' + i + '" class="labelf">`f_' + i + '(X) = `<input class="inputf" type="text" id="f' + i + '"></label>');

		MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
	});

	
});