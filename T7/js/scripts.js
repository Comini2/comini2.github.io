$(document).ready(function(){

	var n;
	var f = [];
	var x = {x1: 0, x2: 2, x3: 0, x4: 0, x5: 0};
	var y = [];

	$("#calcula").click(function(){

		n = !isNaN(parseInt($("#n").val())) ? parseInt($("#n").val()) : 0;

		$(".vals").each(function(){
			var i = $(this).attr('name');
			x[i] = !isNaN(parseFloat($(this).val())) ? parseFloat($(this).val()) : 0;
		});

		$(".inputf").each(function(){
			var i = $(this).attr('name').substring(1);
			f[i] = $(this).val();
		});

	});

	$("#n").change(function(){

		n = !isNaN(parseInt($("#n").val())) ? parseInt($("#n").val()) : 0;

		if(n>5){
			n = 5;
			$("#n").val(n);
		} else if(n<2){
			n = 2;
			$("#n").val(n);
		}


		$("#funcoes").empty();
		$("#xini").empty();

		for(var i = 0; i<n; i++){
			$("#funcoes").append('<label for="f' + (i+1) + '" class="labelf">`f_' + (i+1) + '(X) = `<input class="inputf" type="text" id="f' + (i+1) + '"></label>');
			$("#xini").append('<input class="vals" type="text" name="x' + (i+1) + '">');
		}

		MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
	});

	
});
