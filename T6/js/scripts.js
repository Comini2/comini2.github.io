$(document).ready(function(){


	console.log(gauss("e^x", 0, 5, 2));
	console.log(retEsquerda("e^x", 0, 5, 1000));
	console.log(retDireita("e^x", 0, 5, 1000));
	console.log(trapezio("e^x", 0, 5, 1000));
	console.log(simpson13("e^x", 0, 5, 400));
	console.log(simpson38("e^x", 0, 5, 900));
});