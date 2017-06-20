$(document).ready(function(){

	var mets  = ['_bis', '_cordas', '_newton', '_cordas_m', '_newton_m'];
	var mets_n = ['da Bissecção', 'das Cordas', 'de Newton', 'das Cordas Modificado', 'de Newton Modificado'];
	
	for(var i = 0, len = mets.length; i < len; i++){
		$('body').append('<div class="container-fluid bg-2" id="header' + mets[i] + '"><span role="button"><span class="caret"></span> Método '+ mets_n[i] + '</span></div>');
		var container = $('<div class="collapse container-fluid bg-3" id="container' + mets[i] + '"></div>');
		container.append('<div style="float:left; padding-right: 20px"><h4>Insira a função:</h4><label>f(x): </label><input type="text" name="function' + mets[i] + '" size="50"></div>');
		container.append('<div style="float:left; padding-right: 40px"><h4>Insira o intervalo (a, b):</h4><label>a :</label><input type="text" name="a' + mets[i] +'" size="1" style="margin-right: 10px;"><label>b :</label><input type="text" name="b' + mets[i]+'" size="1"></div>');
		container.append('<div style="float:left; padding-right: 40px"><h4>Insira a tolerância:</h4><label>&epsilon; :</label><input type="text" name="epsilon' + mets[i]+'" size="8" style="margin-right: 10px;"></div>');
		container.append('<div style="float:left; padding-right: 20px"><h4>Insira o número de iterações*:</h4><input type="text" name="maxit' + mets[i]+'" size="8" style="margin-right: 10px;"></div>');
		container.append('<br><br><br><div id = "erros' + mets[i] +'"></div><div id="result' + mets[i]+'" style="width: 50%; float: left;"></div><div style="width: 50%; float: right;" id="plot' + mets[i]+'"></div>');
		container.append('<button id="calc' + mets[i]+'" class="btn calc">Calcular raízes</button><button id="clean' + mets[i]+'" class="btn clean">Limpar</button>');
		container.append('<h5>*Se o número de iterações não for definido, este será definido como 15.<h5>');
		$('body').append(container);
	}
	$('body').append('<footer class="container-fluid bg-4 text-center"><p>Este site foi projetado e desenvolvido por João Comini</a></p></footer>');


	$('.nav_drop').click(function(){
		if (this.hash !== "") {
	
			$header = $(this.hash);
			console.log(this.hash);

			var met = this.hash.substring(this.hash.search('_'));

			var container = '#container'+met;

	    	$content = $(container);
	   		
	   		if(!$content.is(':visible')){

		    	$content.collapse('show');

				  $('html, body').animate({
				    scrollTop: $header.offset().top - 50
				  }, 800, function(){

				  });
	    	}else{

				$('html, body').animate({
					scrollTop: $header.offset().top - 50
				  
				}, 800, function(){

				});
	    	}
	    		
		}
	});

	$('.bg-2').click(function(){

		var id = $(this).attr('id');
		var met = id.substring(id.search('_'));

		$content = $('#container'+met);

		if(!$content.is(':visible')){

		    	$content.collapse('show');

				$('html, body').animate({
					scrollTop: $(this).offset().top - 50
				}, 800, function(){

				});
	    	}
	    	else
	    		$content.collapse('hide');
	});

	$('.btn.clean').click(function(){
		var id = $(this).attr('id');
		var met = id.substring(id.search('_'));
		var $result = $('#result' + met);
		var $plot = $('#plot' + met);
		var $erros = $('#erros' + met);

		$result.empty();
		$plot.empty();
		$erros.empty();

		$('input.error').each(function(){
			if($(this).attr('name').search(met) !== -1){
				$(this).removeClass('error');
			}
		});
		$('input').each(function(){
			if($(this).attr('name').search(met) !== -1){
				$(this).val('');
			}
		});

	});

	$('.btn.calc').click(function(e){

		var id = $(this).attr('id');
		var met = id.substring(id.search('_'));

		var container = '#container'+met;

		$(container).addClass('loading');
		$(container).fadeTo('fast', 0.4);

		var a = 'a' + met;
		var b = 'b' + met;
		var f = 'function' + met;
		var erro = 'epsilon' + met;
		var maxIt = 'maxit' + met;
		var result = '#result' + met;
		var plot = '#plot' + met;

		var $a = $('input[name=' + a +']');
		var $b = $('input[name=' + b +']');
		var $f = $('input[name=' + f +']');
		var $erro = $('input[name=' + erro +']');
		var $maxIt = $('input[name=' + maxIt +']');
		var $erros = $('#erros' + met);

		$erros.empty();

		a = parseFloat($a.val());
		b = parseFloat($b.val());
		f = $f.val();
		erro = parseFloat($erro.val());
		maxIt = parseInt($maxIt.val());

		$('input.error').each(function(){
			if($(this).attr('name').search(met) !== -1){
				$(this).removeClass('error');
			}
		});

		var ok = true;

		if(f === ''){
			$f.addClass('error');
			ok = false;
			$erros.append('<h6>*Função inválida!</h6>');
		}

		if(!$.isNumeric(a)){
			$a.addClass('error');
			ok = false;
			$erros.append('<h6>*Valor inválido para "a".</h6>');
		}
		if(!$.isNumeric(b)){
			$b.addClass('error');
			ok = false;
			$erros.append('<h6>*Valor inválido para "b".</h6>');
		}
		if(!$.isNumeric(erro)){
			$erros.append('<h6>*Valor inválido para tolerância.</h6>');
			$erro.addClass('error');
			ok = false;
		}else if(erro < 1e-6 || erro > 1e-2){
			$erros.append('<h6>*A tolerância deve estar entre 1E-6 e 1E-2.</h6>');
			$erro.addClass('error');
			ok = false;
		}
		if(!$.isNumeric(maxIt) && !isNaN(maxIt)){
			$erros.append('<h6>*Valor inválido para o número de iterações.</h6>');
			$maxIt.addClass('error');
			ok = false;
		}else if(maxIt > 1000 || maxIt < 5){
			$erros.append('<h6>*O número de iterações deve ser menor que 1000 e maior que 5.</h6>');
			$erro.addClass('error');
			ok = false;
		}

		if(a > b){
			$erros.append('<h6>*O intervalo deve ser crescente, ou seja, de "a" para "b", e.g (1, 3).');
			$a.addClass('error');
			$b.addClass('error');
			ok = false;
		}else if(b-a < 1){
			$erros.append('<h6>*A distância do intervalo deve ser maior que 1.');
			$a.addClass('error');
			$b.addClass('error');
			ok = false;
		}

		if(isNaN(maxIt));
			maxIt = 15;

		if(ok){

			var worker = new Worker('js/worker.js')

			var x = [];
			var intervalos = [];

			worker.onmessage = function(e){
				var ferror = false;
				try{
					x = e.data[0];
					intervalos = e.data[1];

					$(result).empty();
					
					if(intervalos.length > 0){
						$(result).append('Intervalos: </br>');
						for(var i = 0, len = intervalos.length; i<len; i++){
							$(result).append('(' + intervalos[i].a.toFixed(4) + ', ' +intervalos[i].b.toFixed(4) + ')');
							if(i + 1<len)
								$(result).append(' ,&nbsp;');
						}
						$(result).append('</br>');
						$(result).append('Raízes: </br>');
						for(var i = 0, len = x.length; i< len; i++){
							$(result).append('X['+ (i+1) +'] &asymp; '+ x[i].toFixed(4));
							if(i + 1<len)
								$(result).append(' ,&nbsp;');
						}
					}else{
						$(result).append('Não foram encontradas possíveis raízes neste intervalo.');
					}

					$(plot).empty();
					$(plot).append('<p>Gráfico: </p>');

					draw(f, plot);

				}catch(err){
					ok = false;
					ferror = true;
				}
				$(container).removeClass('loading');
				$(container).fadeTo('fast', 1);
				
				if(!ok){
					$(result).empty();
					$(plot).empty();
				}
				if(ferror){
					$erros.append('<h6>*Aconteceu algo entranho com a função, tenha certeza de que ela está em função de x.<h6>');
					$f.addClass('error');
				}
			}

			worker.postMessage([met, f, a, b, maxIt, erro]);
		}

		if(!ok){
			$(container).removeClass('loading');
			$(container).fadeTo('fast', 1);
			$(result).empty();
			$(plot).empty();
		}

	});

});

function draw(f, id) {
    try {
      functionPlot({
        target: id,
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