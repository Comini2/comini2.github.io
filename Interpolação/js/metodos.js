function sistemaLinear(x, fx, n, n_pontos, k){
	var m = [];
	var y = [];
	var a = [];

	var cont = 0;
	
	for(var i = 0; i<n_pontos-1; i++){
		for(var j = i+1; j<n_pontos; j++){
			if(x[i] == x[j]){
				x.splice(j, 1);
				fx.splice(j, 1);
				cont--;
			}
		}
	}

	n_pontos += cont;

	if(n < n_pontos-1){

		var clone_x = JSON.parse(JSON.stringify(x));
		var clone_fx = JSON.parse(JSON.stringify(fx));


	}

	for(var i = 0; i<n+1; i++){
		m[i] = [];

		for(var j =0; j<n+1; j++){
			m[i][j] = Math.pow(x[i], j);
		}
		y[i] = fx[i];
	}

	return gauss(m, y, n+1);
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