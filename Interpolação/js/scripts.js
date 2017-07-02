$(document).ready(function(){

	var n_pontos = 3;
	var n = 2;

	var x = [];
	var fx = [];

	$("#n_pontos").val(n_pontos);
	$("#grau").val(n);

	for(var i = 0; i<15; i++){
		x[i] = 0;
		fx[i] = 0;
	}

	atribuiValores();
	atribuiCelulas();

	$("#n_pontos").keyup(function(){

		n_pontos = !isNaN(parseInt($(this).val())) ? parseInt($(this).val()) : 0;

		n_pontos = n_pontos>15 ? 15 : n_pontos;

		n_pontos = n_pontos < n+1 ? n+1 : n_pontos;

		$(this).val(n_pontos);

		atribuiValores();

		desenhaTabela();

		atribuiCelulas();
	});

	$("#grau").keyup(function(){
		n = !isNaN(parseInt($(this).val())) ? parseInt($(this).val()) : 0;

		n_pontos = n_pontos < n+1 ? n+1 : n_pontos;

		atribuiValores();
		desenhaTabela();
		atribuiCelulas();

		$("#n_pontos").val(n_pontos);
	})

	$("#calcula").click(function(){

		atribuiValores();

		var a = sistemaLinear(x, fx, n, n_pontos);
		var f = "";

		for(var i = 0, len = a.length; i<len; i++){
			if(a[i] === 0)
				continue;

			if(i<len-1)
				f += a[i] !== 1 ? a[i] + "x^" + i + "+" : "x^" + i + "+";
			else
				f += a[i] !== 1 ? a[i] + "x^" + i + "+" : "x^" + i;
		}

		if(f[f.length-1] == '+')
			f = f.substring(0, f.length-1);

		$("#polinomio").empty();
		$("#polinomio").append("<p>f(x) = " + f + "</p>");

		console.log(f);
		draw(f);
	});


	function desenhaTabela(){

		$('#x').empty();
		$('#fx').empty();
		$('#indice').empty();

		for(var i = 0; i<n_pontos; i++){
			$('#fx').append('<input type="text" class="cell" name="fx'+ i +'"></input>');
			$('#x').append('<input type="text" class="cell" name="x'+ i +'"></input>');
			$('#indice').append('<label>' + (i+1) + '</label>');
		}
	}

	function atribuiValores(){

		$('#x > .cell').each(function(){
			var name = $(this).attr('name');
			var i = name.substring(1);

			x[i] = !isNaN(parseFloat($(this).val())) ? parseFloat($(this).val()) : 0;
		});

		$('#fx > .cell').each(function(){
			var name = $(this).attr('name');
			var i = name.substring(2);

			fx[i] = !isNaN(parseFloat($(this).val())) ? parseFloat($(this).val()) : 0;
		});
	}

	function atribuiCelulas(){

		$('#fx > .cell').each(function(){

			var name = $(this).attr('name');

			var i = name.substring(2);
			$(this).val(fx[i]);
		});

		$('#x > .cell').each(function(){

			var name = $(this).attr('name');

			var i = name.substring(1);
			$(this).val(x[i]);
		});

	}


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