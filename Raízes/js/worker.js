importScripts('math.js');

this.onmessage = function(e){

	var met = e.data[0];
	var f = e.data[1];
	var a = e.data[2];
	var b = e.data[3];
	var maxIt = e.data[4];
	var erro = e.data[5];

	try{
	var intervalos = buscaUniforme(f, a, b, 0.001, maxIt);

		var x = [];

		if(met === '_bis'){
			x = bisseccao(f, intervalos, maxIt, erro);
		}
		else if(met === '_cordas'){
			x = cordas(f, intervalos, maxIt, erro);
		}
		else if(met === '_newton'){
			x = newton(f, intervalos, maxIt, erro);
		}
		else if(met === '_cordas_m'){
			x = cordasModificado(f, intervalos, maxIt, erro);
		}
		else if(met === '_newton_m'){
			x = newtonModificado(f, intervalos, maxIt, erro);
		}

	}catch(err){
		postMessage(null);
		return;
	}
	postMessage([x, intervalos]);
}

function buscaUniforme(f, a, b, h, maxIt){
	var p = a;
	var q = p + h;

	var fp = math.eval(f, {x: p});
	var fq = math.eval(f, {x: q});

	var intervalos = [];
	while((q<b)){
		if(fp*fq < 0)
			intervalos.push({a: p, b: q});
		p = q;
		q = p + h;
		fp = fq;
		fq = math.eval(f, {x: q});
	}

	return intervalos;
}

function bisseccao(fn, intervalos, maxIt, tolerancia){

	var f = math.compile(fn);
	var x = [];
	for(var i in intervalos){
		var intervalo = intervalos[i];
		var a = intervalo.a;
		var b = intervalo.b;
		var p = (a+b)/2;

		for(var i = 0;Math.abs(b-a) > tolerancia && i<maxIt; i++){
			if(f.eval({x: a}) * f.eval({x: p}) < 0)
				b = p;
			else
				a = p;

			p = (a+b)/2;
		}

		x.push(p);
	}

	return x;
}

function cordas(fn, intervalos, maxIt, tolerancia){

	var x = [];

	var f = math.compile(fn);

	for(var i in intervalos){
		var intervalo = intervalos[i];

		var a = intervalo.a;
		var b = intervalo.b;

		var fa = f.eval({x: a});
		var fb = f.eval({x: b});

		var p = (a*fb-b*fa)/(fb-fa);

		for(var i = 0; Math.abs(b-a) > tolerancia && i<maxIt && Math.abs(f.eval({x: p}) - 0) > tolerancia; i++){
			if(f.eval(math.eval({x: a}) * f.eval({x: p}) < 0))
				b = p;
			else
				a = p;

			var fa = f.eval({x: a});
			var fb = f.eval({x: b});

			var p = (a*fb-b*fa)/(fb-fa);
		}

		x.push(p);
	}

	return x;
}

function newton(fn, intervalos, maxIt, tolerancia){

	var x = [];
	var f = math.compile(fn);
	var f_d = math.derivative(fn, 'x');

	for(var i in intervalos){
		var intervalo = intervalos[i];

		var a = intervalo.a;
		p = a;
		q = p;
		p -= f.eval({x: p})/f_d.eval({x: p});

		for(var i = 0; Math.abs(p-q) > tolerancia && i < maxIt; i++){
			q = p;
			p -= f.eval({x: p})/f_d.eval({x: p});
		}

		x.push(p);
	}

	return x;
}

function cordasModificado(fn, intervalos, maxIt, tolerancia){

	var x = [];

	var f = math.compile(fn);

	for(var i in intervalos){
		var intervalo = intervalos[i];

		var a = intervalo.a;
		var b = intervalo.b;

		var cont_a = 0;
		var cont_b = 0;

		var fa = f.eval({x: a});
		var fb = f.eval({x: b});

		var p = (a*fb-b*fa)/(fb-fa);

		for(var i = 0; Math.abs(b-a) > tolerancia && i<maxIt && Math.abs(f.eval({x: p}) - 0) > tolerancia; i++){
			if(f.eval(math.eval({x: a}) * f.eval({x: p}) < 0)){
				b = p;
				cont_b++;
			}
			else{
				cont_a++;
				a = p;
			}

			if(cont_a != 0 && cont_b != 0){
				cont_a = 0;
				cont_b = 0;
			}

			var fa = f.eval({x: a});
			var fb = f.eval({x: b});

			if(cont_b > 2)
				p = (a*fb-b*fa/2)/(fb-fa/2);
			else if(cont_a > 2)
				p = (a*fb/2-b*fa)/(fb/2-fa);
			else
				p = (a*fb-b*fa)/(fb-fa);
		}

		x.push(p);
	}

	return x;
}

function newtonModificado(fn, intervalos, maxIt, tolerancia){

	var x = [];
	var f = math.compile(fn);
	var f_d = math.derivative(fn, 'x');

	for(var i in intervalos){
		var intervalo = intervalos[i];

		var a = intervalo.a;
		p = a;
		q = p;
		var derivada = f_d.eval({x: p});
		p -= f.eval({x: p})/derivada;

		for(var i = 0; Math.abs(p-q) < tolerancia && i < maxIt; i++){
			q = p;
			if(i%4 === 0)
				derivada = f_d.eval({x: p});
			p -= f.eval({x: p})/derivada;
		}

		x.push(p);
	}

	return x;
}