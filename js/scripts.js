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

		console.log(matriz);

		$('.border-bot').show();
		$('.col-sm-12').show();
		$('.par').show();
		$('.align.op').show();
		$('#matriz_esc').empty();

		$('#x_final').empty();
		$('#b_final').empty();
		$('#resumo').empty();

		switch($('input[name="metodo"]:checked').val()){
			case 'gauss':
				x = gauss(matriz, b, n);
				break;
			case 'gausspp':
				alert('TODO');
				//TODO
				break;
			case 'gausspt':
				alert('TODO');
				//TODO
				break;
			case 'gausscmp':
				alert('TODO');
				//TODO
				break;
			case 'dlu':
				alert('TODO');
				//TODO
				break;
			case 'cholesky':
				//TODO
				ehSimetrico (matriz, n) ? x = cholesky (matriz, n, b) : alert ('A matriz inserida não é simétrica.');
				break;
			case '_jacobi':
				alert('TODO');
				//TODO
				break;
			case '_gauss':
				alert('TODO');
				break;
		}

		
		for (var i = 0; i < n; i++){
			for(var j = 0; j<n; j++)
				$('#matriz_esc').append('<label class="result">' + matriz[i][j] + '</label>');

			$('#matriz_esc').append('<br>');
			$('#x_final').append('<label class="result">' + x[i].toFixed(3) + '</label><br>');
			$('#b_final').append('<label class="result">' + b[i].toFixed(3) + '</label><br>');
			$('#resumo').append('<label class="resumo">x<sub>' + (i+1) + '</sub>= &nbsp;' + x[i] + '</label><br>');
		}

		$('#container_resultado').addClass('border-bot');

		$('img').height($('#matriz_esc').height());
		$('.align.op').css('padding-top', $('#matriz_esc').height()/2 - $('.align.op').height()/2);

		$('html, body').animate({scrollTop: $('.col-sm-12.bot').offset().top}, 800);

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

	$('.cell.m').each(function(){

		var name = $(this).attr('name');
		var indice = name.search(',');

		var j = name.substring(indice+1);
		var i = name.substring(1, indice);

		console.log(matriz[i][j]);

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


function gauss(matriz, b, n){

	var x = [];
	for(var j = 0; j<n-1; j++){
		for(var i = j+1; i<n; i++){
			m = matriz[i][j]/matriz[j][j];
			for(var k = j; k<n; k++)
				matriz[i][k] -= m*matriz[j][k];
			b[i] -= b[j]*m;
		}
	}

	x[n-1] = b[n-1]/matriz[n-1][n-1];

	for(var i = n-2; i>=0; i--){
		var soma = 0;
		for(var j = i+1; j<n; j++){
			soma += matriz[i][j]*x[j];
		}
		x[i] = (b[i]-soma)/matriz[i][i];
	}

	return x;
}

function ehSimetrico (matriz, n) {
	for (var i = 0; i<n-1; i++)
		for (var j = i+1; j<n; j++)
			if (j !== i)
				if (matriz[i][j] !== matriz[j][i])
					return 0;
	return 1;
}

function cholesky (matriz, n , b) {
	var g = [];
	var soma = 0;
	var x = [];
	var y = [];

	for (var i = 0; i<n; i++)
		g[i] = [];

	//"Decomposição de A em G.GT"
	for (var k = 0; k<n; k++) {
		soma = 0;
		for (var j = 0; j<k-1; j++)
			soma += g[k][j];
		try {
			g[k][k] = Math.sqrt (matriz[k][k] - soma);
		}catch (err) {
			alert (err);
		}

		for (var i=k+1; i<n; i++) {
			soma = 0;
			for (var j=0; j< k-1; j++)
				soma += g[i][j]*g[k][j]
			g[i][k] = (matriz[i][k] - soma)/g[k][k];
		}
	}

	console.log(g);

	//"Preenchendo a GT"
	for (var i=0; i< n-1; i++)
		for (var j = i+1; j< n; j++)
			g[i][j] = g[j][i]

	//"Solução de G.y = b por Substituição"
	try {
		y[0] = b[0]/g[0][0];
	}catch (err) {
		alert ('algo deu errado na hora de montar o y');
	}

	for (var i = 1;i<n;i++) {
		soma = 0;
		for (var j = 0; j < i-1; j++)
			soma += g[i][j]*y[j];
		try {
			y[i] = (b[i]-soma)/g[i][i];
		}catch (err) {
			alert ('algo deu errado na hora de montar o y');
		}
	}

	//"Solução de GT.x = y por Retrosubstituição"
	try {
		x[n-1] = y[n-1]/g[n-1][n-1];
	}catch (err) {
		alert ('Algo deu errado na hora de montar o x');
	}

	for (var i = n-2; i >= 0; i--) {
		soma = 0;
		for (var j = i+1; j<n; j++)
			soma += g[i][j]*x[j];
		try {
			x[i] = (y[i] - soma)/g[i][i];
		}catch (err) {
			alert ('Algo deu errado na hora de montar o x');
		}
	}

	return x;
}

