$(document).ready(function(){

	var n, maxIt, tolerancia;
	var f = [];
	var x = {x1: 0, x2: 0, x3: 0, x4: 0, x5: 0};

	$("#calcula").click(function(){

		n = !isNaN(parseInt($("#n").val())) ? parseInt($("#n").val()) : 0;
		maxIt = !isNaN(parseInt($("#it").val())) ? parseInt($("#it").val()) : 0;
		tolerancia = !isNaN(parseFloat($("#tol").val())) ? parseFloat($("#tol").val()) : 0;

		$(".vals").each(function(){
			var i = $(this).attr('name');
			x[i] = !isNaN(parseFloat($(this).val())) ? parseFloat($(this).val()) : 0;
		});

		$(".inputf").each(function(){
			var i = $(this).attr('name').substring(1);
			f[i-1] = $(this).val();
			f[i-1] = f[i-1].replace(/[\[\]]+/g, '');
		});

		switch($('input[name="metodo"]:checked').val()){
			case 'n':
			x = newton(f, x, n, maxIt, tolerancia);
			break;
			case 'nm':
			x = newtonModificado(f, x, n, maxIt, tolerancia);
			break;
		}

		$("#resultado").empty();

		$("#resultado").append('`X = `');

		var raizes = "`(";

		for(var i = 0; i<n; i++){
			if(i<n-1)
				raizes += "("+x["x"+(i+1)].toFixed(3) + "),"
			else
				raizes += "("+x["x"+(i+1)].toFixed(3) + ")"
		}	

		raizes += ")`";

		$("#resultado").append(raizes);

		MathJax.Hub.Queue(["Typeset",MathJax.Hub]);

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
			$("#funcoes").append('<label for="f' + (i+1) + '" class="labelf">`f_' + (i+1) + '(X) = `<input class="inputf" type="text" name="f' + (i+1) + '"></label>');
			$("#xini").append('<input class="vals" type="text" name="x' + (i+1) + '">');
		}

		MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
	});

	
});
