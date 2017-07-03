function polinomio(x, fx, n_pontos, grau){

	var m = [];
	var b = [];

	for(var i = 0; i<grau; i++){
		m[i] = [];
		for(var j = 0; j<grau; j++){
			if(!i && !j){
				m[i][j] = n_pontos;
				continue;
			}
			if(i>j)
				m[i][j] = somatoria(x, i, n_pontos);
			else if(j>i)
				m[i][j] = somatoria(x, j, n_pontos);
			else if(j === i)
				m[i][j] = somatoria(x, i+i, n_pontos);
		}

		b[i] = somatoriaProduto(x, fx, i, n_pontos);
	}

	return gauss(m, b, grau);
}

function exp1(x, fx, n_pontos){

	var m = [];
	var b = [];
	var y = [];

	for(var i = 0; i<n_pontos; i++)
		y[i] = Math.log(fx[i]);

	for(var i = 0; i<2; i++){
		m[i] = [];
		for(var j = 0; j<2; j++){
			if(!i && !j){
				m[i][j] = n_pontos;
				continue;
			}
			if(i>j)
				m[i][j] = somatoria(x, i, n_pontos);
			else if(j>i)
				m[i][j] = somatoria(x, j, n_pontos);
			else if(j === i)
				m[i][j] = somatoria(x, i+i, n_pontos);
		}

		b[i] = somatoriaProduto(x, y, i, n_pontos);
	}

	var a = gauss(m, b, 2);

	for(var i = 0; i<2; i++)
		a[i] = Math.exp(a[i]);

	return a;
}

function exp2(x, fx, n_pontos){
	var m = [];
	var b = [];
	var y = [];

	for(var i = 0; i<n_pontos; i++)
		y[i] = Math.log(fx[i]);

	for(var i = 0; i<2; i++){
		m[i] = [];
		for(var j = 0; j<2; j++){
			if(!i && !j){
				m[i][j] = n_pontos;
				continue;
			}
			if(i>j)
				m[i][j] = somatoria(x, i, n_pontos);
			else if(j>i)
				m[i][j] = somatoria(x, j, n_pontos);
			else if(j === i)
				m[i][j] = somatoria(x, i+i, n_pontos);
		}

		b[i] = somatoriaProduto(x, y, i, n_pontos);
	}

	var a = gauss(m, b, 2);

	a[0] = Math.exp(a[0]);

	return a;
}

function exp3(x, fx, n_pontos){
	var m = [];
	var b = [];

	var y = [];
	var lnx = [];

	for(var i = 0; i<n_pontos; i++){
		y[i] = Math.log(fx[i]);
		lnx[i] = Math.log(x[i]);
	}

	for(var i = 0; i<2; i++){
		m[i] = [];
		for(var j = 0; j<2; j++){
			if(!i && !j){
				m[i][j] = n_pontos;
				continue;
			}
			if(i>j)
				m[i][j] = somatoria(lnx, i, n_pontos);
			else if(j>i)
				m[i][j] = somatoria(lnx, j, n_pontos);
			else if(j === i)
				m[i][j] = somatoria(lnx, i+i, n_pontos);
		}

		b[i] = somatoriaProduto(lnx, y, i, n_pontos);
	}

	var a = gauss(m, b, 2);

	a[0] = Math.exp(a[0]);

	return a;
}

function coeficiente(f, x, fx, n){
	var func = math.compile(f);

	var y = [];

	for(var i = 0; i<n; i++)
		y[i] = func.eval({x: x[i]});

	console.log(y);

	var e = somatoriaErroQuadrado(fx, y, n);

	var syq = somatoria(fx, 2, n);
	var sqy = Math.pow(somatoria(fx, 1, n), 2);

	return (1 - (n*e)/(n*syq - sqy)).toFixed(4);
}

function somatoria(vetor, exp, n){
	var soma = 0;

	for(var i = 0; i<n; i++)
		soma+= Math.pow(vetor[i], exp);

	return soma;
}

function somatoriaProduto(x, y, exp, n){
	var soma = 0;

	for(var i = 0; i<n; i++)
		soma+= Math.pow(x[i], exp)*y[i];

	return soma;
}

function somatoriaErroQuadrado(x, y, n){
	var soma = 0;

	for(var i = 0; i<n; i++)
		soma+= Math.pow(x[i] - y[i], 2);

	return soma;
}

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