$(document).ready(function(){

	var n = 3;
	var matriz = [];
	var b = [];
	var xIni = [];
	var x = [];

	$('input[name="tipo"]').change(function(){
		if($(this).val() == "dir"){
			$("#dir").prop("disabled", false);
			$("#it").prop("disabled", true);
			$('.cell.x').parent().remove();
			$('.cell.x').remove();
		}else{
			$("#dir").prop("disabled", true);
			$("#it").prop("disabled", false);
			for(var i = 0; i<n; i++)
				$('input[name="b'+i+'"]').parent().after('<label for="cell x">&rarr;<input type="text" name="x'+i+'ini" class="cell x">(x<sub>ini' + (i+1) +' </sub>)</label>');
		}
	});

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
		var clone = JSON.parse(JSON.stringify(matriz));
		var clone_b = JSON.parse(JSON.stringify(b));

		$('#resumo').empty();
		$("#resultado").empty();
		$("#inversa").empty();
		$("#det").empty();

		var inv = inversa(clone, n);

		if($('input[name="tipo"]').val() == 'dir'){
			switch($("#dir").val()){
			case 'gauss':
				x = gauss(clone, clone_b, n);
				break;
			case 'gausspp':
				x = gaussParcial(clone, clone_b, n);
				break;
			case 'gausspt':
				x = gaussTotal(clone, clone_b, n);
				break;
			case 'gausscmp':
				x = gaussCompacto(clone, n, clone_b);
				break;
			case 'dlu':
				x = decomposicaoLU(clone, n, clone_b);
				break;
			case 'cholesky':
				ehSimetrico (clone, n) && determinante(det, n) > 0 ? x = cholesky (clone, n, clone_b) : alert ('A matriz inserida não é simétrica.');
				break;
			}
		}else{
			switch($("it").val()){
			case 'jacobi':
				var maxIt = $('#maxIt').val();
				var tolerancia = $('#erro').val();
				x = jacobi(clone, clone_b, xIni, n, maxIt, tolerancia);
				break;
			case 'seidel':
				var maxIt = $('#maxIt').val();
				var tolerancia = $('#erro').val();
				x = seidel(clone, clone_b, xIni, n, maxIt, tolerancia);
				break;
			}
		}

		var m_esc = "`[";
		var m_inv = "`[";
		var b_final = "`[";
		var x_final = "`["


		for (var i = 0; i < n; i++){
			m_esc += "[";
			m_inv += "[";
			b_final += "[";
			x_final += "[";

			for(var j = 0; j<n; j++){
				if(j<n-1){
					m_esc += clone[i][j].toFixed(2) + ',';
					m_inv += inv[i][j].toFixed(2) + ',';
				}
				else{
					m_esc += clone[i][j].toFixed(2);
					m_inv += inv[i][j].toFixed(2);
				}
			}
			if(i<n-1){
				m_esc += "],";
				m_inv += "],";
				x_final += x[i].toFixed(3);
				b_final += clone_b[i].toFixed(2);
				b_final += "],";
				x_final += "],";
				$('#resumo').append('`x_' + (i+1) + '= &nbsp;' + x[i].toFixed(5) + ',`');
			}else{
				m_esc += "]";
				m_inv += "]";
				x_final += x[i].toFixed(3);
				b_final += clone_b[i].toFixed(2);
				b_final += "]";
				x_final += "]";
				$('#resumo').append('`x_' + (i+1) + '= &nbsp;' + x[i].toFixed(5) + '`');
			}
		}

		m_esc += "]`";
		m_inv += "]`";
		b_final += "]`";
		x_final += "]`";;

		$("#resultado").append("`A.X = `" +m_esc + x_final + "`=`" + b_final);
		$("#inversa").append("`A^-1 = `" + m_inv);
		$('#inversa').append('`rarrdet(A) = ' + determinante(det, n).toFixed(5) +'`');

		MathJax.Hub.Queue(["Typeset",MathJax.Hub], function(){
			$("html, body").animate({scrollTop: $("#container_resultado").offset().top}, 500);
		});
		

	});

	$('.zero').keyup(function(){
			$(this).removeClass('zero');
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
		$("#resultado").empty();
	});

	$('#ordem').change(function(){

		n = !isNaN(parseInt($(this).val())) ? parseInt($(this).val()) : n;

		if(n > 5){
			n = 5;
			$(this).val(n);
		}else if(n<2){
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
		$('.zero').keyup(function(){
			$(this).removeClass('zero');
		});

	});

	$('.cell').focus(function(){
			$(this).select();

	});

function attValores(){

	$('.cell.x').each(function(){
		var name = $(this).attr('name');
		var i = name[name.length - 1];

		xIni[i] = !isNaN(parseFloat($(this).val())) ? parseFloat($(this).val()) : 0;
	});

	$('.cell.m').each(function(){

		var name = $(this).attr('name');
		var indice = name.search(',');

		var j = name.substring(indice+1);
		var i = name.substring(1, indice);

		matriz[i][j] = !isNaN(parseFloat($(this).val())) ? parseFloat($(this).val()) : 0;
	});

	$('.cell.b').each(function(){
		var name = $(this).attr('name');
		var i = name.substring(1);

		b[i] = !isNaN(parseFloat($(this).val())) ? parseFloat($(this).val()) : 0;
	});


}

function desenhaSistema(){

	$div_m.empty();

	for(var i = 0; i<n; i++){
		$row = $('<div class="col-sm-12 m-row"></div>');
		for(var j = 0; j<n; j++){
			if(j < n-1)
				$row.append('<label for="cell"><input type="text" name="m'+i+','+j+'" class="cell m"><span>.x<sub>'+(j+1)+ '</sub>+</span></label>');
			else{
				$row.append('<label for="cell"><input type="text" name="m'+i+','+j+'" class="cell m"><span>.x<sub>'+(j+1)+ '</sub>=</span></label>');
				$row.append('<label for="cell"><input type="text" name="b'+i+'" class="cell b"><span>(b<sub>' + (i+1) +' </sub>)</span></label>');
			}
		}
		$div_m.append($row);
	}

	if($('input[name="tipo"]:checked').val() == "it"){
		for(var i = 0; i<n; i++)
			$('input[name="b'+i+'"]').parent().after('<label for="cell x">&rarr;<input type="text" name="x'+i+'ini" class="cell x">(x<sub>ini' + (i+1) +' </sub>)</label>');
	}

}

});