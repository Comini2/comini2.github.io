function sistemaLinear(x, fx, n, z){
	var m = [];
	var y = [];
	var f = "";

	for(var i = 0; i<n+1; i++){
		m[i] = [];

		for(var j =0; j<n+1; j++)
			m[i][j] = Math.pow(x[i], j);
		y[i] = fx[i];
	}

	var a = gauss(m, y, n+1);

	for(var i = 0, len = a.length; i<len; i++){
		if(a[i] === 0)
			continue;

		if(i<len-1)
			f += a[i] !== 1 ? a[i] + "x^" + i + " +" : "x^" + i + " +";
		else
			f += a[i] !== 1 ? a[i] + "x^" + i + " +" : "x^" + i;
	}

	f = f[f.length-1] == '+' ? f.substring(0, f.length-1) : f;

	return math.simplify(f).toString();
}

function newton(x, fx, n){

	var y = [];
	var f = "";

	for(var i = 0; i<n+1; i++){

		y[i] = [];
		if(!i){
			y[i] = fx;
			continue;
		}

		for(var j = 0; j<n+1 - i; j++)
			y[i][j] = (y[i-1][j+1] - y[i-1][j])/(x[i+j]-x[j]);
	}

	for(var i = 0; i<n+1; i++){
		f+= y[i][0];
		f+= i < n+1 - 1 ? " + (x -" + x[i] + ")*(" : "";
	}

	for(var i = 0; i<n+1 - 1; i++)
		f+= ")";

	return math.simplify(f).toString();
}

function nGregory(x, fx, n){

	var y = [];
	var f = "";

	var h = Math.abs(x[0] - x[1]);

	for(var i = 1; i<n+1 - 1; i++){
		if(Math.abs(x[i] - x[i+1]) !== h)
			return null;
	}

	for(var i = 0; i<n+1; i++){

		y[i] = [];
		if(!i){
			y[i] = fx;
			continue;
		}

		for(var j = 0; j<n+1 - i; j++)
			y[i][j] = (y[i-1][j+1] - y[i-1][j]);
	}

	f+= y[0][0];
	f+= " + (x -" + x[0] + ")*(";

	for(var i = 1; i<n+1; i++){
		f+= y[i][0]/(fact(i)*Math.pow(h, i));
		f+= i < n+1 - 1 ? " + (x -" + x[i] + ")*(" : "";
	}

	for(var i = 0; i<n+1 - 1; i++)
		f+= ")";

	return math.simplify(f).toString();

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

function corrigeVetores(x, fx, z, n_pontos, n){

	for(var i = 0; i<n_pontos-1; i++){
		for(var j = i+1; j<n_pontos; j++){
			if(x[i] == x[j]){
				x.splice(j, 1);
				fx.splice(j, 1);
				n_pontos--;
			}
		}
	}

	if(n + 1 < n_pontos){
		var ind;

		var len = n_pontos - (n + 1);

		for(var j = 0; j<len; j++){
			var dist = -Infinity;
			for(var i = 0; i<n_pontos; i++){
				if(Math.abs(x[i] - z) > dist){
					dist = Math.abs(x[i] - z);
					ind = i;
				}
			}
			fx.splice(ind, 1);
			n_pontos--;
		}
	}

	console.log(n_pontos);
	
	return n_pontos;
}

function fact(num){
    var rval=1;
    for (var i = 2; i <= num; i++)
        rval = rval * i;
    return rval;
}