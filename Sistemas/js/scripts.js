$(document).ready(function(){

	var n = 3;
	var matriz = [];
	var b = [];
	var xIni = [];
	var x = [];

	$('.par').hide();
	$('.align.op').hide();

	var $div_m = $('#matriz');

	desenhaSistema();

	for(var i = 0; i<10; i++){
		matriz[i] = [];
		b[i] = 0;
		for(var j = 0; j<10; j++){
			matriz[i][j] = 0;
		}
	}

	$('.cell').val(0);
	$('.cell.m').addClass('zero');

	$('#ordem').val(n);
	$('#maxIt').val(10);
	$('#erro').val(0.001);

	$('#calcula').click(function(){

		attValores();

		var det = JSON.parse(JSON.stringify(matriz));

		$('#det').remove();
		$('.border-bot').show();
		$('.col-sm-12').show();
		$('.par').show();
		$('.align.op').show();
		$('#matriz_esc').empty();
		$('#matriz_inv').empty();
		$('#inv h3').remove();

		$('#inv br').remove();

		$('#x_final').empty();
		$('#b_final').empty();
		$('#resumo').empty();

		var inv = inversa(matriz, n);

		switch($('input[name="metodo"]:checked').val()){

			case 'gauss':
				x = gauss(matriz, b, n);
				break;
			case 'gausspp':
				x = gaussParcial(matriz, b, n);
				break;
			case 'gausspt':
				x = gaussTotal(matriz, b, n);
				break;
			case 'gausscmp':
				x = gaussCompacto(matriz, n, b);
				break;
			case 'dlu':
				x = decomposicaoLU(matriz, n, b);
				//TODO
				break;
			case 'cholesky':
				ehSimetrico (matriz, n) && determinante(matriz, n) > 0 ? x = cholesky (matriz, n, b) : alert ('A matriz inserida não é simétrica.');
				break;
			case '_jacobi':
				var maxIt = $('#maxIt').val();
				var tolerancia = $('#erro').val();
				x = jacobi(matriz, b, xIni, n, maxIt, tolerancia);
				break;
			case '_gauss':
				var maxIt = $('#maxIt').val();
				var tolerancia = $('#erro').val();
				x = seidel(matriz, b, xIni, n, maxIt, tolerancia);
				break;
		}

		$('#inv').prepend("<br><h3>Inversa: </h3>");

		for (var i = 0; i < n; i++){

			for(var j = 0; j<n; j++){
				$('#matriz_esc').append('<label class="result">' + matriz[i][j].toFixed(2) + '</label>');
				$('#matriz_inv').append('<label class="result">' + inv[i][j].toFixed(2) + '</label>');
			}

			$('#matriz_esc').append('<br>');
			$('#matriz_inv').append('<br>');

			$('#x_final').append('<label class="result">' + x[i].toFixed(3) + '</label><br>');
			$('#b_final').append('<label class="result">' + b[i].toFixed(2) + '</label><br>');
			$('#resumo').append('<label class="resumo">x<sub>' + (i+1) + '</sub>= &nbsp;' + x[i] + '</label><br>');

		}



		$('#resultado').append('<div id="det"><br><h3>det(A) = ' + determinante(det, n) +'</h3></div>');

		$('#container_resultado').addClass('border-bot');

		$('img').height($('#matriz_esc').height());
		$('.align.op').css('padding-top', $('#matriz_esc').height()/2 - $('.align.op').height()/2);

		$('html, body').animate({scrollTop: $('.col-sm-12.bot').offset().top}, 800);

		$('#resumo').height($('#resumo').parent().height() - 80);

	});

	$('.cell.m').keyup(function(){
			($(this).val() !== 0) ? $(this).removeClass('zero') : $(this).addClass('zero');
	});


	$('#ordem').focus(function(){
			$(this).select();
	});
	$('#maxIt').focus(function(){
			$(this).select();
	});
	$('#erro').focus(function(){
			$(this).select();
	});

	$('#limpa').click(function(){
		$('.cell').val(0);
		$('.cell.m').addClass('zero');
	});

	$('#limpa_sol').click(function(){
		$('#resumo').empty();
		$('.par').hide();
		$('.align.op').hide();
		$('#matriz_esc').empty();
		$('#resultado h3').remove();

		$('#matriz_inv').empty();
		$('#inv h3').remove();

		$('#inv br').remove();

		$('#x_final').empty();
		$('#b_final').empty();
	})

	$('input[name="metodo"]').click(function(){
		desenhaXinicial();
	});


	$('#ordem').keyup(function(){

		n = !isNaN($(this).val()) ? parseInt($(this).val()) : n;

		if(n > 10){
			n = 10;
			$(this).val(n);
		}else if(n<=0){
			n = 3;
			$(this).val(n);
		}else if(!isNaN(n))
			$(this).val(n);

		desenhaSistema();

		for(var i = 0; i<n; i++){
			for(var j=0; j<n; j++){
				var $input = $('input[name="m'+i+','+j+'"]');

				if(matriz[i][j] === 0)
					$input.addClass('zero');

				$input.val(matriz[i][j]);
			}
		}

		for(var i = 0; i<n; i++){
			$('input[name="b'+i+'"]').val(b[i]);
		}

		$('.cell').focus(function(){
			$(this).select();
		});

	});

	$('.cell').focus(function(){
			$(this).select();
	});

function attValores(){

	$('.cell.x').each(function(){
		var name = $(this).attr('name');
		var i = name[name.length - 1];

		xIni[i] = !isNaN($(this).val()) ? parseFloat($(this).val()) : 0;
	});

	$('.cell.m').each(function(){

		var name = $(this).attr('name');
		var indice = name.search(',');

		var j = name.substring(indice+1);
		var i = name.substring(1, indice);

		matriz[i][j] = !isNaN($(this).val()) ? parseFloat($(this).val()) : 0;
	});

	$('.cell.b').each(function(){
		var name = $(this).attr('name');
		var i = name.substring(1);

		b[i] = !isNaN($(this).val()) ? parseFloat($(this).val()) : 0;
	});


}

function desenhaSistema(){

	$div_m.empty();
	$div_m.append('<img src="img/colchete.png" style="margin-right: 10px; float: left;" id="colchete">');

	$table = $('<div class="box align"></div>');
	for(var i = 0; i<n; i++){
		$row = $('<div class="row-m"></div>');
		for(var j = 0; j<n; j++){
			if(j < n-1)
				$row.append('<label for="cell"><input type="text" name="m'+i+','+j+'" class="cell m"><span>.x<sub>'+(j+1)+ '</sub>+</span></label>');
			else{
				$row.append('<label for="cell"><input type="text" name="m'+i+','+j+'" class="cell m"><span>.x<sub>'+(j+1)+ '</sub>=</span></label>');
				$row.append('<label for="cell"><input type="text" name="b'+i+'" class="cell b"><span>(b<sub>' + (i+1) +' </sub>)</span></label>');
			}
			$table.append($row);
		}
		$div_m.append($table);

		$('#colchete').height($('#colchete').next().height());
	}

	desenhaXinicial();
}

function desenhaXinicial(){
	if($('input[name="metodo"]:checked').val().search('_') !== -1 && !$('.cell.x').length){
			for(var i = 0; i<n; i++){
				$('input[name="b'+i+'"]').parent().after('<label for="cell">--><input type="text" name="xini'+i+'" class="cell x">(x<sub>ini' + (i+1) +' </sub>)</label>');
			}
	}else if($('.cell.x').length && $('input[name="metodo"]:checked').val().search('_') === -1){
			$('.cell.x').parent().remove();
			$('.cell.x').remove();
	}
}

});