$(document).ready(function(){

	$(document).keydown(function(e){
		if(e.which === 27)
			$(".fixed").hide();
	});

	$('.fixed').click(function(e){
		if(e.target.className === 'fixed')
			$(".fixed").hide();
	});

	var n_pontos = 3;

	var x = [];
	var fx = [];

	$("#n_pontos").val(n_pontos);

	$(".fixed").hide();

	for(var i = 0; i<15; i++){
		x[i] = 0;
		fx[i] = 0;
	}

	atribuiValores();
	atribuiCelulas();

	for(var i = 0; i<5; i++){
		$row = $('<div class="col-sm-12"></div>');
		$row.append('<div class="col-sm-2"><h4 class="border-bot">'+ (i+1) +'</h4></div>');
		$row.append('<div class="col-sm-1"><h4 class="border-bot">'+ (i+2) +' <input type="checkbox" name="grau" value="'+ (i+2) +'"></h4></div>');
		$cols = $('<div class="col-sm-9"></div>');
		for(var j = 0; j<6; j++)
			$cols.append('<div class ="col-sm-2 a" id="a'+ (i+1) + j +'"><h4 class="border-bot">-</h4></div>');

		$row.append($cols);

		$("#poli").append($row);
	}

	$('input[name="graus"]').change(function(){
		$('input[name="grau"]').prop('checked', true);
	});

	$('input[name="grau"]').change(function(){
		if(!$(this).is(":checked")){
			$('input[name="graus"]').prop('checked', false);
		}
		else if($('input[name="grau"]').length === $('input[name="grau"]:checked').length)
			$('input[name="graus"]').prop('checked', true);
	});

	$("#n_pontos").keyup(function(){

		n_pontos = !isNaN(parseInt($(this).val())) ? parseInt($(this).val()) : 0;

		n_pontos = n_pontos>15 ? 15 : n_pontos;

		$(this).val(n_pontos);

		atribuiValores();
		desenhaTabela();
		atribuiCelulas();
	});

	$("#calcula").click(function(){

		n_pontos = !isNaN(parseInt($("#n_pontos").val())) ? parseInt($("#n_pontos").val()) : 0;

		$("#resultados").empty();
		$("#options").children().not('button, h4, h6').remove();

		atribuiValores();

		$('input[name="grau"]').each(function(){
			if($(this).is(":checked")){
				var a = polinomio(x, fx, n_pontos, $(this).val());
				for(var i = 0; i<a.length; i++){
					var id = "#a" + ($(this).val()-1) + i + " > h4";
					$(id).text(a[i].toFixed(5));
				}
			}else{
				for(var i = 0; i<6; i++){
					var id = "#a" + ($(this).val()-1) + i + " > h4";
					$(id).text('-');
				}
			}
		});

		$('input[name="outros"]:checked').each(function(){
			var a = null;

			var f = $(this).val();

			switch(f){
				case "a + b*x":
					a = polinomio(x, fx, n_pontos, 2);
					break;
				case "a*b^x":
					a = exp1(x, fx, n_pontos);
					break;
				case "a*e^(b*x)":
					a = exp2(x, fx, n_pontos);
					break;
				case "a*x^b":
					a = exp3(x, fx, n_pontos);
					break;
			}
			
			var b = a[1].toFixed(5);
			var a = a[0].toFixed(5);

			var ind = f.search('a');

			f = f.substring(0, ind) + a + f.substring(ind+1);

			ind = f.search('b');

			f = f.substring(0, ind) + b + f.substring(ind + 1);

			var rq = coeficiente(f, x, fx, n_pontos);
			$("#resultados").append('<div class = "col-sm-12 border-bot"><div class = "col-sm-8"><h4>`y = '+ $(this).val() +'` <span class="arrow">&#8594;</span> `y = '+ f +'`</h4></div><div class= "col-sm-4"><h4>`R = ' + rq + '`</h4></div></div>');
			$("#mostra").before('<div class="rad"><input type="radio" name="funcao" value ="' + f + '"> `y = '+ f +'`</div>');

		});

		$('#grafico').click(function(){

			$('.fixed').show();

			$('#plot').hide();

			$('#options').show();

			$("#options").css({top: $('#options').parent().height()/2 - $('#options').height()/2, left: $('#options').parent().width()/2 - $('#options').width()/2});
		});

		$('#mostra').click(function(){
			if($('input[name="funcao"]:checked').length > 0){
				$('#options').hide();
				$('#plot').show();
				var f = $('input[name="funcao"]:checked').val();

				draw(f);

				$("#plot").css({top: $('#plot').parent().height()/2 - $('#plot').height()/2, left: $('#plot').parent().width()/2 - $('#plot').width()/2});
			}
		})

		MathJax.Hub.Queue(["Typeset",MathJax.Hub]);

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