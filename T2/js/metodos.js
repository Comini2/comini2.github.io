function buscaUniforme(fn, a, b, h, maxIt){
	var p = a;
	var q = p + h;

	var f = math.compile(fn);

	var fp = f.eval({x: p});
	var fq = f.eval({x: q});

	var intervalos = [];
	while((q<b)){
		if(fp*fq < 0)
			intervalos.push({a: p, b: q});
		p = q;
		q = p + h;
		fp = fq;
		fq = f.eval({x: q});
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
			if(!(i%4))
				derivada = f_d.eval({x: p});
			p -= f.eval({x: p})/derivada;
		}

		x.push(p);
	}

	return x;
}