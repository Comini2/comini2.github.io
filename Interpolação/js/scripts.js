$(document).ready(function(){

	var n_pontos = 3;
	var n = 2;

	var x = [];
	var fx = [];

	$("#n_pontos").val(n_pontos);
	$("#grau").val(n);
	$("#ref").val(0);

	for(var i = 0; i<15; i++){
		x[i] = 0;
		fx[i] = 0;
	}

	atribuiValores();
	atribuiCelulas();

	draw("");

	$("#n_pontos").keyup(function(){

		n_pontos = !isNaN(parseInt($(this).val())) ? parseInt($(this).val()) : 0;

		n_pontos = n_pontos>15 ? 15 : n_pontos;

		n_pontos = n_pontos < 2 ? 2: n_pontos;

		n = n_pontos < n+1 ? n_pontos - 1 : n; 

		$(this).val(n_pontos);

		atribuiValores();
		desenhaTabela();
		atribuiCelulas();

		$("#grau").val(n);
	});

	$("#grau").keyup(function(){
		n = !isNaN(parseInt($(this).val())) ? parseInt($(this).val()) : 0;

		n_pontos = n_pontos < n+1 ? n+1 : n_pontos;

		atribuiValores();
		desenhaTabela();
		atribuiCelulas();

		$("#n_pontos").val(n_pontos);
	});

	$("#calcula").click(function(){

		n_pontos = !isNaN(parseInt($("#n_pontos").val())) ? parseInt($("#n_pontos").val()) : 0;
		n = !isNaN(parseInt($("#grau").val())) ? parseInt($("#grau").val()) : 0;

		atribuiValores();

		var z = !isNaN(parseFloat($("#ref").val())) ? parseFloat($("#ref").val()) : 0;

		var f = "";

		var clone_x = JSON.parse(JSON.stringify(x));
		var clone_fx = JSON.parse(JSON.stringify(fx));

		n_pontos = corrigeVetores(clone_x, clone_fx, z, n_pontos, n);

		console.log(n);

		switch($('input[name="metodo"]:checked').val()){
			case 'sistema':
				f = sistemaLinear(clone_x, clone_fx, n, z);
				break;
			case 'newton':
				f = newton(clone_x, clone_fx, n);
				break;
			case 'gregory':
				f = nGregory(clone_x, clone_fx, n);
				break;
		}

		$("#polinomio").empty();
		$("#polinomio").append("<p>f(x) = " + f + "</p>");

		draw(f);
	});


	function desenhaTabela(){

		$('#x').empty();
		$('#fx').empty();
		$('#indice').empty();

		for(var i = 0; i<n_pontos; i++){
			$('#fx').append('<input type="text" class="cell" name="fx'+ i +'"></input>');
			$('#x').append('<input type="text" class="cell" name="x'+ i +'"></input>');
			$('#indice').append('<label>' + i + '</label>');
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