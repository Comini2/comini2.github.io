 function derivadaParcial (f, x, margem, i){

       var h, xi, mais, menos, q, erro, p;
       var func = math.compile(f);

       h = 1024*margem;
       erro = Infinity;
       xi = x["x"+i];
       x["x"+i] = xi + h;
       mais = f.eval(x);
       x["x"+i] = xi - h;
       menos = f.eval(x);
       p = (mais-menos)/(2*h);

      for(var j = 0; j<20; j++){
        q = p;
        h = h/2;
        x[i] = xi + h;
        if (FxRn (f, x, Colchetes, mais) <> 0) then Exit (-22);
        x[i] = xi - h;
        if (FxRn (f, x, Colchetes, menos) <> 0) then Exit (-22);
        p = (mais-menos)/(2*h);

        if abs (p-q) < margem then begin
           x[i] = xi;
           Exit (p);
        end;

        if erro < abs (q-p) then begin
           x[i] = xi;
           Exit (q) //verifica se começou a divergir
       end else erro = abs (q-p);
}