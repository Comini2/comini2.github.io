$(document).ready(function(){

	draw("");

	$("#calcula").click(function(e){

		var f, a, b, maxIt, erro, passo, x = [], intervalos;

		$("h6").hide();

		f = $("#funcao").val();
		a = !isNaN(parseInt($("#a").val())) ? parseInt($("#a").val()) : 0;
		b = !isNaN(parseInt($("#b").val())) ? parseInt($("#b").val()) : 0;
		maxIt = !isNaN(parseInt($("#maxIt").val())) ? parseInt($("#maxIt").val()) : 0;
		passo = !isNaN(parseFloat($("#passo").val())) ? parseFloat($("#passo").val()) : 0;
		erro = !isNaN(parseFloat($("#erro").val())) ? parseFloat($("#erro").val()) : 0;

		if(!passo || !erro || (passo < 1e-6 && passo > 1e-2) || (erro < 1e-6 && erro > 1e-2)){
			$("h6").show();
		}

		if(!maxIt){
			$("#maxIt").val(10);
			maxIt = 10;
		}


		intervalos = buscaUniforme(f, a, b, passo, maxIt);

		switch($('input[name="metodo"]:checked').val()){
			case 'bis':
				x = bisseccao(f, intervalos, maxIt, erro);
				break;
			case 'cordas':
				x = cordas(f, intervalos, maxIt, erro);
				break;
			case 'newton':
				x = newton(f, intervalos, maxIt, erro);
				break;
			case 'cordasm':
				x = cordasModificado(f, intervalos, maxIt, erro);
				break;
			case 'newtonm':
				x = newtonModificado(f, intervalos, maxIt, erro);
				break;
		}

		var s = "";

		for(var i = 0, n = x.length; i<n; i++){
			if(!i){
				$("#func").empty();
				$("#func").append("`f(x) = " + f + "`<span class='arrow'>`rarr`</span>");
			}
			if(i<n-1)
				s += "`x_" + i + " ~~ " + x[i].toFixed(4) + ", `";
			else
				s += "`x_" + i + " ~~ " + x[i].toFixed(4) + "`";
		}

		$("#resultado").empty();
		$("#resultado").append(s);
		draw(f);

		MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
		
	});


});

function draw(f) {
    try {
      functionPlot({
        target: "#plot",
        data: [{
          fn: f,
          sampler: 'builtIn',
          graphType: 'polyline'
        }]
      });
    }
    catch (err) {
      console.log(err);
      alert(err);
    }
  }