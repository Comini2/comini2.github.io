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

function jacobiano(f, x, n){
	var j = [];
	for(var i = 0; i<n; i++)
		j[i] = gradiente(f[i], x, n);

	return j;	
}


function newton(f, x, n, maxIt, tolerancia){

	var j, hk, fx = [], funcs = [];
	var xant = {x1: 0, x2: 0, x3: 0, x4: 0, x5: 0};

	for(var i = 0; i<n; i++){
		funcs[i] = math.compile(f[i]);
		fx[i] = -funcs[i].eval(x);
	}

	xant = copia(x, n);
	j = jacobiano(f, xant, n);
	hk = decomposicaoLU(j, fx, n);
	x = soma(xant, hk, n);

	for(var i = 0; i<maxIt && norma(x, xant, n) > tolerancia; i++){
		for(var j = 0; j<n; j++){
			fx[j] = -funcs[j].eval(x);
		}
		
		xant = copia(x, n);
		j = jacobiano(f, x, n);
		hk = decomposicaoLU(j, fx, n);
		x = soma(xant, hk, n);
	}
	return x;
}

function newtonModificado(f, x, n, maxIt, tolerancia){

	var j, hk, fx = [], funcs = [];
	var xant = {x1: 0, x2: 0, x3: 0, x4: 0, x5: 0};

	for(var i = 0; i<n; i++){
		funcs[i] = math.compile(f[i]);
		fx[i] = -funcs[i].eval(x);
	}

	xant = copia(x, n);
	jac = jacobiano(f, xant, n);
	hk = decomposicaoLU(JSON.parse(JSON.stringify(jac)), fx, n);
	x = soma(xant, hk, n);

	for(var i = 0; i<maxIt && norma(x, xant, n) > tolerancia; i++){
		for(var j = 0; j<n; j++)
			fx[j] = -funcs[j].eval(x);
		
		xant = copia(x, n);
		if(i%4)
			jac = jacobiano(f, x, n);
		hk = decomposicaoLU(JSON.parse(JSON.stringify(jac)), fx, n);
		x = soma(xant, hk, n);
	}
	return x;
}


function copia(x, n){
	var c = {x1: 0, x2: 0, x3: 0, x4: 0, x5: 0};
	for (var i = 0; i<n; i++)
		c["x"+(i+1)] = x["x"+(i+1)];
	return c;
}

function soma(x, hk, n){
	var s = {x1: 0, x2: 0, x3: 0, x4: 0, x5: 0};
	for(var i = 0; i<n; i++)
		s["x"+(i+1)] = hk[i]+x["x"+(i+1)];
	return s;
}

function norma(x1, x2, n){

	var soma = 0;
	for(var i = 0; i<n; i++)
		soma += Math.pow(x1["x"+(i+1)] - x2["x"+(i+1)], 2);
	
	return Math.sqrt(soma);
}

function decomposicaoLU(matriz, b, n){
	var soma;
	var l = [];
	var u = [];
	var y = [];
	var x = [];

	for(var i = 0; i<n; i++){
		l[i] = [];
		l[i][i] = 1;

		u[i] = [];
	}

	for(var i = 0; i <n; i++){
		for(var j = i; j < n; j++){
			soma = 0;
			for(var k = 0; k<i; k++)
				soma += l[i][k]*u[k][j];
			u[i][j] = matriz[i][j] - soma;
		}
		for(var j = i+1 ; j<n; j++){
			soma = 0;
			for(var k = 0; k<i; k++)
				soma += l[j][k]*u[k][i];
			l[j][i] = (matriz[j][i] - soma)/u[i][i];
		}
	}

	y[0] = b[0]/l[0][0];

	for(var i = 1; i<n; i++){
		soma = 0;
		for(var j = 0; j<i; j++)
			soma += l[i][j]*y[j];
		y[i] = (b[i]-soma)/l[i][i];
	}

	x[n-1] = y[n-1]/u[n-1][n-1];

	for(var i = n-2; i>=0; i--){
		soma = 0;
		for(var j = i+1; j<n; j++)
			soma += u[i][j]*x[j];
		x[i] = (y[i]-soma)/u[i][i];
	}

	return x;
}