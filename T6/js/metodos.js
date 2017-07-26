function gauss(f, a, b, n){
	var func = math.compile(f);
	var soma = 0;
	var t = [-math.sqrt(3)/3, math.sqrt(3)/3];
	var w = [1, 1];
	for(var i = 0; i<n; i++){
		x = (a*(1-t[i]) + b*(1+t[i]))/2;
		soma += w[i]*func.eval({x: x});
	}
	return (b-a)*soma/2;
}

function retEsquerda(f, a, b, n){
	var func = math.compile(f);
	var h = (b-a)/n;
	var soma = 0;
	for(var i = 0; i<n; i++)
		soma += func.eval({x: a + i*h})*h;

	return soma;
}

function retDireita(f, a, b, n){
	var func = math.compile(f);
	var h = (b-a)/n;
	var soma = 0;
	for(var i = 1; i<n+1; i++)
		soma += func.eval({x: a + i*h})*h;

	return soma;
}

function trapezio(f, a, b, n){
	var func = math.compile(f);
	var h = (b-a)/n;
	var soma = (func.eval({x: a}) + func.eval({x: b}))/2;
	for(var i = 1; i<n; i++)
		soma += func.eval({x: a + i*h});

	return soma*h;
}

function simpson13(f, a, b, n){
	if(n % 2 !== 0)
		return null;

	var func = math.compile(f);
	var h = (b-a)/n;
	var soma = (func.eval({x: a}) + func.eval({x: b}));
	for(var i = 1; i<n; i++)
		if(i % 2 !== 0)
			soma += 4*func.eval({x: a + i*h});
		else
			soma += 2*func.eval({x: a + i*h});

	return soma*h/3;
}

function simpson38(f, a, b, n){
	if(n % 3 !== 0)
		return null;

	var func = math.compile(f);
	var h = (b-a)/n;
	var soma = (func.eval({x: a}) + func.eval({x: b}));
	for(var i = 1; i<n; i++)
		if(i % 3 !== 0)
			soma += 3*func.eval({x: a + i*h});
		else
			soma += 2*func.eval({x: a + i*h});

	return soma*h*3/8;
}