$(document).ready(function(){

	var a;
	var b;
	var n;
	var s;
	var f;

	draw("");

	$("#calcula").click(function(){
		$("h6").hide();
		a = !isNaN(parseFloat($("#a").val())) ? parseFloat($("#a").val()) : 0;
		b = !isNaN(parseFloat($("#b").val())) ? parseFloat($("#b").val()) : 0;
		f = $("#funcao").val();
		n = !isNaN(parseInt($("#n").val())) ? parseInt($("#n").val()) : 0;

		switch($('input[name="metodo"]:checked').val()){
			case 'esq':
				s = retEsquerda(f, a, b, n);
				break;
			case 'dir':
				s = retDireita(f, a, b, n);
				break;
			case 'trap':
				s = trapezio(f, a, b, n);
				break;
			case 'simp13':
				s = simpson13(f, a, b, n);
				break;
			case 'simp38':
				s = simpson38(f, a, b, n);
				break;
			case 'quad':
				s = gauss(f, a, b, n);
				break;
		}

		try{
			draw(f);
			$("#resultado").empty();
			$("#resultado").append("`int_" + a + "^" + b + f + "dx = " + s.toFixed(10) + "`");
		}catch(err){
			$("#resultado").append("`int_a^b f(x) dx = S`");
			$("h6").show();
			console.log(err.message);
		}

		MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
	});

	
});

function draw(f) {
    try {
      functionPlot({
        target: "#plot",
        data: [{
          fn: f,
          sampler: 'builtIn',
          graphType: 'polyline'
        }]
      });
    }
    catch (err) {
      console.log(err);
      alert(err);
    }
  }