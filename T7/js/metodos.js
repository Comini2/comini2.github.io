 function derivadaParcial (f, x, i){

	var h, xi, mais, menos, q, erro, p;
	var func = math.compile(f);

	h = 1024*1e-4;
	erro = Infinity;
	xi = x["x"+i];
	x["x"+i] = xi + h;
	mais = func.eval(x);
	x["x"+i] = xi - h;
	menos = func.eval(x);
	p = (mais-menos)/(2*h);

	for(var j = 0; j<20; j++){
		q = p;
		h = h/2;
		x["x"+i] = xi + h;
		mais = func.eval(x);
		x["x"+i] = xi - h;
			menos = func.eval(x);
		p = (mais-menos)/(2*h);

		if(Math.abs (p-q)){
		   x["x"+i] = xi;
		   return p;
		}

		if(erro < Math.abs (q-p)){
		   x["x"+i] = xi;
		   return q;
		}else
			erro = Math.abs (q-p);
	}
}

function gradiente(f, x, n){
	var y = [];

	for(var i = 0; i<n; i++){
		y[i] = derivadaParcial(f, x, i+1);
		if(y[i] === undefined)
			y[i] = 0;
	}
	return y;
}

function jacobiano(f, n, x){
	var j = [];
	for(var i = 0; i<n; i++)
		j[i] = [];

	
}