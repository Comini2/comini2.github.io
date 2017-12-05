function gauss(f, a, b, n){
	var func = math.compile(f);
	var soma = 0;
	var g = gaussLegendre(n);
	var t = g.t;
	var w = g.w;
	for(var i = 0; i<n; i++){
		x = (a*(1-t[i]) + b*(1+t[i]))/2;
		soma += w[i]*func.eval({x: x});
	}
	return (b-a)*soma/2;
}

function retEsquerda(f, a, b, n){
	var func = math.compile(f),  h = (b-a)/n, soma = 0;
	for(var i = 0; i<n; i++)
		soma += func.eval({x: a + i*h})*h;

	return soma;
}

function retDireita(f, a, b, n){
	var func = math.compile(f),  h = (b-a)/n, soma = 0;
	for(var i = 1; i<n+1; i++)
		soma += func.eval({x: a + i*h})*h;

	return soma;
}

function trapezio(f, a, b, n){
	var func = math.compile(f),  h = (b-a)/n, soma = (func.eval({x: a}) + func.eval({x: b}))/2;
	for(var i = 1; i<n; i++)
		soma += func.eval({x: a + i*h});

	return soma*h;
}

function simpson13(f, a, b, n){
	if(n % 2 !== 0)
		return null;

	var func = math.compile(f), h = (b-a)/n, soma = (func.eval({x: a}) + func.eval({x: b}));
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

	var func = math.compile(f), h = (b-a)/n, soma = (func.eval({x: a}) + func.eval({x: b}));
	
	for(var i = 1; i<n; i++)
		if(i % 3 !== 0)
			soma += 3*func.eval({x: a + i*h});
		else
			soma += 2*func.eval({x: a + i*h});

	return soma*h*3/8;
}

function gaussLegendre(n){
	var m = parseInt((n+1)/2), xm = 0, xl = 1, z, p1, p2, p3, pp, z;
	var PI = Math.PI;
	var eps = 1e-12;
	var t = [];
	var w =[];

	for(var i = 0; i<m; i++){
		z = math.cos(PI*((i+1) - 0.25)/(n+0.5));
		do{
			p1 = 1;
			p2 = 0;
			for(var j = 0; j<n; j++){
				p3 = p2;
				p2 = p1;
				p1 = ((2*(j+1)-1)*z*p2 -j*p3)/(j+1);
			}
			pp = n*(z*p1-p2)/(z*z-1);
			z1 = z;
			z = z1-p1/pp;
		}while(Math.abs(z-z1) > eps);
		t[i] = xm-xl*z;
		t[n-i-1] = xm+xl*z;
		w[i] = 2*xl/((1-z*z)*pp*pp);
		w[n-i-1] = w[i];
	}

	return {t: t, w: w};
}