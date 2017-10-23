function ehSimetrico (matriz, n) {
	for (var i = 0; i<n-1; i++)
		for (var j = i+1; j<n; j++)
			if (j !== i)
				if (matriz[i][j] !== matriz[j][i])
					return 0;
	return 1;
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

function gaussParcial(matriz, b, n){

	var x = [];
	for(var j = 0; j<n-1; j++){

		var maior = -Infinity;
		var p;
		for(var r = j; r<n; r++){
			if(matriz[r][j] > maior){
				p = r;
				maior = matriz[r][j];
			}
		}

		if(p !== j){
			var aux = matriz[j];
			matriz[j] = matriz[p];
			matriz[p] = aux;

			aux = b[j];
			b[j] = b[p];
			b[p] = aux;
		}


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

function gaussTotal(matriz, b, n){

	var x = [];
	for(var j = 0; j<n-1; j++){

		var maior = -Infinity;
		var p;
		var q;

		for(var r = j; r<n; r++){
			for(var s = j; s<n; s++){
				if(matriz[r][s] > maior){
					p = r;
					q = s;
					maior = matriz[r][s];
				}
			}
		}

		if(p !== j){
			var aux = matriz[j];
			matriz[j] = matriz[p];
			matriz[p] = aux;

			aux = b[j];
			b[j] = b[p];
			b[p] = aux;
		}

		if(q !== j){
			var aux;
			for(var i = j; i<n; i++){
				aux = matriz[i][j];
				matriz[i][j] = matriz[i][q];
				matriz[i][j] = aux;
			}
		}

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

function gaussCompacto(matriz, n, b){

	var soma;
	var y = [];
	var x = [];

	for(var i = 0; i <n; i++){
		for(var j = i; j < n; j++){
			soma = 0;
			for(var k = 0; k<i; k++)
				soma += matriz[i][k]*matriz[k][j];
			matriz[i][j] = matriz[i][j] - soma;
		}
		for(var j = i+1 ; j<n; j++){
			soma = 0;
			for(var k = 0; k<i; k++)
				soma += matriz[j][k]*matriz[k][i];
			matriz[j][i] = (matriz[j][i] - soma)/matriz[i][i];
		}
	}

	y[0] = b[0]/matriz[0][0];

	for(var i = 1; i<n; i++){
		soma = 0;
		for(var j = 0; j<i; j++)
			soma += matriz[i][j]*y[j];
		y[i] = (b[i]-soma);
	}

	x[n-1] = y[n-1]/matriz[n-1][n-1];

	for(var i = n-2; i>=0; i--){
		soma = 0;
		for(var j = i+1; j<n; j++)
			soma += matriz[i][j]*x[j];
		x[i] = (y[i]-soma)/matriz[i][i];
	}

	return x;
}

function cholesky (matriz, n , b) {
	var soma = 0;
	var x = [];
	var y = [];
	var g = [];

	for(var i = 0; i<n; i++)
		g[i] = [];

	//"Decomposição de A em G.GT"
	for (var k = 0; k<n; k++) {
		soma = 0;

		for (var j = 0; j<k; j++)
			soma += g[k][j]*g[k][j];

		try {
			g[k][k] = Math.sqrt (matriz[k][k] - soma);
		}catch (err) {
			alert (err);
		}

		for (var i=k+1; i<n; i++) {
			soma = 0;
			for (var j=0; j<k; j++)
				soma += g[i][j]*g[k][j];
			g[i][k] = (matriz[i][k] - soma)/g[k][k];
		}
	}

	//"Preenchendo a GT"
	for (var i=0; i< n-1; i++)
		for (var j = i+1; j< n; j++)
			g[i][j] = g[j][i];

	//"Solução de G.y = b por Substituição"
	try {
		y[0] = b[0]/g[0][0];
	}catch (err) {
		alert ('Algo deu errado na hora de montar o y');
	}

	for (var i = 1;i<n;i++) {
		soma = 0;
		for (var j = 0; j < i; j++)
			soma += g[i][j]*y[j];
		try {
			y[i] = (b[i]-soma)/g[i][i];
		}catch (err) {
			alert ('Algo deu errado na hora de montar o y');
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

function decomposicaoLU(matriz, n, b){
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

function jacobi(matriz, b, xini, n, maxIt, tolerancia){

	var x = [];

	if(!CDL(matriz, n) && !CDC(matriz, n)){
		alert("Os critérios não foram satisfeitos.");
		return;
	}

	for(var k = 0; k<maxIt; k++){
		for(var i = 0; i<n; i++){
			var soma = 0;
			for(var j = 0; j<n; j++){
				if(j !== i)
					soma += matriz[i][j]*xini[j];
			}
			x[i] = (b[i] - soma)/matriz[i][i];
		}
		if(distancia(x, xini, n) < tolerancia){
			return x;
		}
		xini = JSON.parse(JSON.stringify(x));
	}
	return x;
}

function seidel(matriz, b, xini, n, maxIt, tolerancia){

	if(!CDL(matriz, n) && !CDS(matriz, n)){
		alert("Os critérios não foram satisfeitos.");
		return;
	}

	var x = JSON.parse(JSON.stringify(xini));

	for(var k = 0; k<maxIt; k++){
		for(var i = 0; i<n; i++){
			var soma = 0;
			for(var j = 0; j<n; j++){
				if(j!==i)
					soma += matriz[i][j]*x[j];
			}
			x[i] = (b[i] - soma)/matriz[i][i];
		}
		if(distancia(x, xini, n) < tolerancia){
			return x;
		}
		xini = JSON.parse(JSON.stringify(x));
	}

	return x;
}

function determinante(matriz, n){
	var soma;
	var l = [];
	var u = [];

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

	var det = 1;
	for(var i = 0; i<n; i++)
		det *= u[i][i];
	
	return det;
}

function inversa(matriz, n){


	var ident = [];
	var invt = [];
	var inv = [];

	var clone = JSON.parse(JSON.stringify(matriz));

	for(var i = 0; i<n; i++){
		ident[i] = [];
		for(var j = 0; j<n; j++)
			ident[i][j] = i===j ? 1 : 0;
	}

	for(var i = 0; i<n; i++)
		invt[i] = decomposicaoLU(clone, n, ident[i]);

	for(var i = 0; i<n; i++){
		inv[i] = [];
		for(var j = 0; j<n; j++)
			inv[i][j] = invt[j][i];
	}

	return inv;
}

function distancia(xk, x, n){
	var xsub = [];

	for(var i = 0; i<n; i++){
		xsub[i] = xk[i] - x[i];
	}

	return norma(xsub, n)/norma(xk, n);

}

function norma(vetor, n){
	var soma = 0;

	for(var i = 0; i<n; i++)
		soma = vetor[i]*vetor[i];

	return Math.sqrt(soma);
}

function CDL(matriz, n){
	var max = 0;
	var soma;

	for (var i = 0; i < n; i++) {
		soma = 0;
		for(var j = 0; j<n; j++){
			if(i !== j)
				soma += Math.abs(matriz[i][j]);
		}
		soma /= Math.abs(matriz[i][i]);
		if(max < soma)
			max = soma;
	}
	console.log(max);

	return max < 1;
}

function CDC(matriz, n){
	var max = 0;
	var soma;

	for (var j = 0; j < n; j++) {
		soma = 0;
		for(var i = 0; i<n; i++){
			if(i !== j)
				soma += Math.abs(matriz[i][j]);
		}
		soma /= Math.abs(matriz[j][j]);
		if(max < soma)
			max = soma;
	}
	console.log(max);

	return max < 1;
}

function CDS(matriz, n){
	var max= 0;
	var b = [];

	for(var i = 0; i<n; i++){
		b[i] = 0;
		for(var j = 0; j<i; j++)
			b[i] += Math.abs(matriz[i][j]/matriz[i][i])*b[j];
		for(var j = i+1; j<n; j++)
			b[i] += Math.abs(matriz[i][j]/matriz[i][i]);
		if(max < b[i])
			max = b[i];
	}

	return max < 1;
}