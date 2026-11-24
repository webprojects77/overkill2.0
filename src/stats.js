Object.assign(TL,{
  nums(text){
    const t=text.trim().split(/[\s,;]+/).filter(Boolean);
    if(!t.length)throw new CalcError("sintaxe","Sem dados",0);
    if(t.length>5000)throw new CalcError("numérico","Limite de 5000 valores",0);
    return t.map(x=>evaluate(x));
  },
  quant(s,p){const i=(s.length-1)*p,lo=Math.floor(i),hi=Math.ceil(i);return s[lo]+(s[hi]-s[lo])*(i-lo)},
  stats(a){
    const n=a.length,s=[...a].sort((x,y)=>x-y);
    let mean=0,m2=0;
    a.forEach((v,i)=>{const d=v-mean;mean+=d/(i+1);m2+=d*(v-mean)});
    const cnt=new Map();a.forEach(v=>cnt.set(v,(cnt.get(v)||0)+1));
    const top=Math.max(...cnt.values()),modes=top>1?[...cnt].filter(([,c])=>c===top).map(([v])=>v).sort((x,y)=>x-y):[];
    const q1=TL.quant(s,.25),q3=TL.quant(s,.75),iqr=q3-q1;
    const out=s.filter(v=>v<q1-1.5*iqr||v>q3+1.5*iqr);
    const vp=m2/n,vs=n>1?m2/(n-1):NaN,f=v=>Number.isNaN(v)?"indefinido (n = 1)":fmt(v);
    return ["n = "+n,"soma = "+fmt(a.reduce((x,y)=>x+y,0)),"média = "+fmt(mean),"mediana = "+fmt(TL.quant(s,.5)),
      "moda = "+(modes.length?modes.slice(0,5).map(fmt).join(", "):"sem moda"),
      "mín = "+fmt(s[0])+" · máx = "+fmt(s[n-1])+" · amplitude = "+fmt(s[n-1]-s[0]),
      "Q1 = "+fmt(q1)+" · Q3 = "+fmt(q3)+" · IQR = "+fmt(iqr),
      "variância populacional = "+fmt(vp),"variância amostral = "+f(vs),
      "desvio padrão populacional = "+fmt(Math.sqrt(vp)),"desvio padrão amostral = "+f(Math.sqrt(vs)),
      "erro padrão da média = "+f(Math.sqrt(vs/n)),
      "outliers (1,5×IQR): "+(out.length?out.slice(0,10).map(fmt).join(", "):"nenhum")].join("\n");
  },
  regress(pts,x0){
    const n=pts.length;
    if(n<2)throw new CalcError("dimensão","Precisa de ao menos 2 pontos",0);
    let mx=0,my=0;pts.forEach(([x,y])=>{mx+=x;my+=y});mx/=n;my/=n;
    let sxx=0,sxy=0,syy=0;pts.forEach(([x,y])=>{sxx+=(x-mx)**2;sxy+=(x-mx)*(y-my);syy+=(y-my)**2});
    if(sxx===0)throw new CalcError("domínio","Todos os x são iguais: não há reta de regressão",0);
    const b=sxy/sxx,a=my-b*mx,r=syy===0?NaN:sxy/Math.sqrt(sxx*syy),r2=syy===0?1:sxy*sxy/(sxx*syy);
    let t="y = "+fmt(b)+"·x "+(a<0?"− ":"+ ")+fmt(Math.abs(a))+"\nn = "+n+"\ninclinação = "+fmt(b)+"\nintercepto = "+fmt(a)+"\nr = "+(Number.isNaN(r)?"indefinida (y constante)":fmt(r))+"\nR² = "+fmt(r2);
    if(x0!==null){
      const xs=pts.map(p=>p[0]);
      t+="\n\nprevisão para x = "+fmt(x0)+": y ≈ "+fmt(a+b*x0)+(x0<Math.min(...xs)||x0>Math.max(...xs)?"\naviso: extrapolação, fora do intervalo dos dados":"");
    }
    return t;
  }
});
function statsUI(){
  const out=$("#stOut");
  const run=()=>{
    try{
      const txt=$("#stIn").value;
      if($("#stMode").value==="desc"){out.textContent=TL.stats(TL.nums(txt));return}
      const pts=txt.trim().split("\n").filter(l=>l.trim()).map((l,i)=>{
        const t=l.trim().split(/[\s,;]+/);
        if(t.length!==2)throw new CalcError("dimensão","Linha "+(i+1)+": use dois valores, x e y",0);
        return t.map(v=>evaluate(v));
      });
      const xv=$("#stX").value.trim();
      out.textContent=TL.regress(pts,xv?evaluate(xv):null);
    }catch(e){out.textContent=errText(e)}
  };
  $("#stMode").onchange=()=>{$("#stIn").value=$("#stMode").value==="desc"?"2 4 4 4 5 5 7 9":"1 1\n2 2\n3 2\n4 3\n5 5";run()};
  $("#stIn").oninput=run;$("#stX").oninput=run;
  run();
}
if(typeof document!=="undefined"&&document.getElementById("tl"))statsUI();
