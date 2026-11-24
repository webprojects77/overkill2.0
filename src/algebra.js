function evalAlg(src,A){
  const t=tokenize(src);let i=0;const end=src.trimEnd().length;
  const peek=()=>t[i],next=()=>t[i++];
  const isOp=v=>peek()&&peek().t==="op"&&peek().v===v;
  const close=()=>{if(!isOp(")"))throw new CalcError("sintaxe","Faltou fechar o parêntese",peek()?peek().p:end);next()};
  function expr(){let l=term();while(isOp("+")||isOp("-")){const o=next();const r=term();l=o.v==="+"?A.add(l,r):A.sub(l,r)}return l}
  function term(){
    let l=unary();
    for(;;){
      const k=peek();if(!k)break;
      if(k.t==="op"&&(k.v==="*"||k.v==="/")){next();const r=unary();l=k.v==="*"?A.mul(l,r):A.div(l,r,k.p)}
      else if(k.t==="num"||k.t==="id"||(k.t==="op"&&k.v==="(")){l=A.mul(l,power())}
      else break;
    }
    return l;
  }
  function unary(){
    if(isOp("-")){next();return A.neg(unary())}
    if(isOp("+")){next();return unary()}
    return power();
  }
  function power(){const b=postfix();if(isOp("^")){const k=next();return A.pow(b,unary(),k.p)}return b}
  function postfix(){
    let v=primary();
    while(isOp("!")||isOp("%")){const k=next();v=k.v==="!"?A.fact(v,k.p):A.div(v,A.num(100,k.p),k.p)}
    return v;
  }
  function primary(){
    const k=next();
    if(!k)throw new CalcError("sintaxe","Expressão incompleta",end);
    if(k.t==="num")return A.num(k.v,k.p,k.s);
    if(k.t==="op"&&k.v==="("){const v=expr();close();return v}
    if(k.t==="id"){
      if(isOp("(")&&!A.isConst(k.v)){
        next();const args=[];
        if(!isOp(")")){args.push(expr());while(isOp(",")){next();args.push(expr())}}
        close();
        return A.call(k.v,args,k.p);
      }
      return A.sym(k.v,k.p);
    }
    throw new CalcError("sintaxe","Símbolo inesperado “"+k.v+"”",k.p);
  }
  if(!t.length)throw new CalcError("sintaxe","Expressão vazia",0);
  const v=expr();
  if(i<t.length)throw new CalcError("sintaxe","Símbolo inesperado “"+t[i].v+"”",t[i].p);
  return v;
}
const C=(re,im=0)=>({re:re===0?0:re,im:im===0?0:im});
const CX={
  isConst:n=>["i","pi","e","tau","phi","ans"].includes(n),
  num:v=>C(v),
  add:(a,b)=>C(a.re+b.re,a.im+b.im),
  sub:(a,b)=>C(a.re-b.re,a.im-b.im),
  neg:a=>C(-a.re,-a.im),
  mul:(a,b)=>C(a.re*b.re-a.im*b.im,a.re*b.im+a.im*b.re),
  div(a,b,p){
    const d=b.re*b.re+b.im*b.im;
    if(d===0)throw new CalcError("domínio","Divisão por zero",p);
    return C((a.re*b.re+a.im*b.im)/d,(a.im*b.re-a.re*b.im)/d);
  },
  exp(a){const m=Math.exp(a.re);return C(m*Math.cos(a.im),m*Math.sin(a.im))},
  ln(a,p){
    const m=Math.hypot(a.re,a.im);
    if(m===0)throw new CalcError("domínio","Logaritmo de zero",p);
    return C(Math.log(m),Math.atan2(a.im,a.re));
  },
  pow(a,b,p){
    if(b.im===0&&Number.isInteger(b.re)&&Math.abs(b.re)<=64){
      let r=C(1);for(let k=0;k<Math.abs(b.re);k++)r=CX.mul(r,a);
      return b.re<0?CX.div(C(1),r,p):r;
    }
    if(a.re===0&&a.im===0){
      if(b.im===0&&b.re>0)return C(0);
      throw new CalcError("domínio","Zero elevado a expoente não positivo ou complexo",p);
    }
    return CX.exp(CX.mul(b,CX.ln(a,p)));
  },
  fact(a,p){
    if(a.im!==0||a.re<0||!Number.isInteger(a.re))throw new CalcError("domínio","Fatorial exige inteiro não negativo",p);
    if(a.re>170)throw new CalcError("numérico","Fatorial acima de 170 excede o limite",p);
    let r=1;for(let k=2;k<=a.re;k++)r*=k;return C(r);
  },
  sym(n,p){
    if(n==="i")return C(0,1);
    if(n==="pi")return C(Math.PI);
    if(n==="e")return C(Math.E);
    if(n==="tau")return C(2*Math.PI);
    if(n==="phi")return C((1+Math.sqrt(5))/2);
    if(n==="ans")return C(st.ans);
    if(n in st.vars)return C(st.vars[n]);
    throw new CalcError("sintaxe","Nome desconhecido “"+n+"”",p);
  },
  call(n,a,p){
    if(a.length!==1)throw new CalcError("sintaxe","“"+n+"” espera 1 argumento no modo ℂ",p);
    const z=a[0];
    if(n==="sqrt"){const m=Math.hypot(z.re,z.im),s=Math.sqrt((m+z.re)/2),u=Math.sqrt((m-z.re)/2);return C(s,z.im<0?-u:u)}
    if(n==="exp")return CX.exp(z);
    if(n==="ln"||n==="log")return CX.ln(z,p);
    if(n==="abs")return C(Math.hypot(z.re,z.im));
    if(n==="arg"){if(z.re===0&&z.im===0)throw new CalcError("domínio","Argumento de zero",p);return C(Math.atan2(z.im,z.re))}
    if(n==="conj")return C(z.re,-z.im);
    if(n==="re")return C(z.re);
    if(n==="im")return C(z.im);
    if(n==="sin")return C(Math.sin(z.re)*Math.cosh(z.im),Math.cos(z.re)*Math.sinh(z.im));
    if(n==="cos")return C(Math.cos(z.re)*Math.cosh(z.im),-Math.sin(z.re)*Math.sinh(z.im));
    if(n==="tan")return CX.div(CX.call("sin",a,p),CX.call("cos",a,p),p);
    throw new CalcError("sintaxe","Função “"+n+"” não disponível no modo ℂ",p);
  },
  show(z){
    const lim=1e-14*Math.max(1,Math.abs(z.re),Math.abs(z.im)),re=Math.abs(z.re)<lim?0:z.re,im=Math.abs(z.im)<lim?0:z.im;
    if(!Number.isFinite(re)||!Number.isFinite(im))throw new CalcError("numérico","Resultado fora do intervalo representável",0);
    if(im===0){st.info="";return fmt(re)}
    const ai=Math.abs(im),is=(ai===1?"":fmt(ai))+"i",m=Math.hypot(re,im),th=Math.atan2(im,re);
    st.info="|z| = "+fmt(m)+" · arg = "+fmt(th)+" rad ("+fmt(th*180/Math.PI)+"°)";
    return re===0?(im<0?"-":"")+is:fmt(re)+(im<0?" − ":" + ")+is;
  }
};
const gcdB=(a,b)=>{a=a<0n?-a:a;b=b<0n?-b:b;while(b){[a,b]=[b,a%b]}return a};
const isqrt=n=>{if(n<2n)return n;let x=1n<<BigInt((n.toString(2).length+1)>>1);for(;;){const y=(x+n/x)>>1n;if(y>=x)return x;x=y}};
const Rq=(n,d=1n)=>{if(d<0n){n=-n;d=-d}const g=gcdB(n,d)||1n;return big({n:n/g,d:d/g})};
function big(x){
  if((x.n<0n?-x.n:x.n).toString(16).length+x.d.toString(16).length>4000)throw new CalcError("numérico","Número grande demais para o modo ℚ",0);
  return x;
}
const qfloor=q=>q.n/q.d-(q.n%q.d<0n?1n:0n);
const QA={
  isConst:n=>["pi","e","tau","phi","i","ans"].includes(n),
  num(v,p){
    if(!Number.isFinite(v))throw new CalcError("numérico","Número fora do intervalo",p);
    if(v<0)return QA.neg(QA.num(-v,p));
    const m=String(v).match(/^(\d+)(?:\.(\d+))?(?:e([+-]?\d+))?$/);
    if(!m)throw new CalcError("sintaxe","Número inválido",p);
    const fr=m[2]||"",e=m[3]?parseInt(m[3],10):0;
    if(Math.abs(e)>400)throw new CalcError("numérico","Expoente grande demais para o modo ℚ",p);
    let n=BigInt(m[1]+fr),d=10n**BigInt(fr.length);
    if(e>=0)n*=10n**BigInt(e);else d*=10n**BigInt(-e);
    return Rq(n,d);
  },
  add:(a,b)=>Rq(a.n*b.d+b.n*a.d,a.d*b.d),
  sub:(a,b)=>Rq(a.n*b.d-b.n*a.d,a.d*b.d),
  neg:a=>({n:-a.n,d:a.d}),
  mul:(a,b)=>Rq(a.n*b.n,a.d*b.d),
  div(a,b,p){
    if(b.n===0n)throw new CalcError("domínio","Divisão por zero",p);
    return Rq(a.n*b.d,a.d*b.n);
  },
  pow(a,b,p){
    if(b.d!==1n)throw new CalcError("domínio","Expoente fracionário não é exato: use sqrt() para raízes exatas ou o modo ℝ",p);
    const e=b.n<0n?-b.n:b.n;
    if(e>1000n)throw new CalcError("numérico","Expoente grande demais",p);
    if(a.n===0n&&b.n<0n)throw new CalcError("domínio","Zero elevado a expoente negativo",p);
    const r=Rq(a.n**e,a.d**e);
    return b.n<0n?Rq(r.d,r.n):r;
  },
  fact(a,p){
    if(a.d!==1n||a.n<0n)throw new CalcError("domínio","Fatorial exige inteiro não negativo",p);
    if(a.n>1000n)throw new CalcError("numérico","Fatorial acima de 1000 excede o limite",p);
    let r=1n;for(let k=2n;k<=a.n;k++)r*=k;return Rq(r);
  },
  sym(n,p){
    if(n==="ans")return QA.num(st.ans,p);
    if(n in st.vars)return QA.num(st.vars[n],p);
    if(QA.isConst(n))throw new CalcError("domínio","“"+n+"” não é racional: use o modo ℝ"+(n==="i"?" ou ℂ":""),p);
    throw new CalcError("sintaxe","Nome desconhecido “"+n+"”",p);
  },
  call(n,a,p){
    const arity={gcd:2,lcm:2};
    if(a.length!==(arity[n]||1))throw new CalcError("sintaxe","“"+n+"” espera "+(arity[n]||1)+" argumento(s)",p);
    const z=a[0];
    if(n==="abs")return Rq(z.n<0n?-z.n:z.n,z.d);
    if(n==="sqrt"){
      if(z.n<0n)throw new CalcError("domínio","Raiz quadrada de número negativo",p);
      const rn=isqrt(z.n),rd=isqrt(z.d);
      if(rn*rn!==z.n||rd*rd!==z.d)throw new CalcError("domínio","Raiz não exata: use o modo ℝ",p);
      return Rq(rn,rd);
    }
    if(n==="floor")return Rq(qfloor(z));
    if(n==="ceil")return Rq(-qfloor(QA.neg(z)));
    if(n==="round")return Rq(qfloor(QA.add(z,{n:1n,d:2n})));
    if(n==="num")return Rq(z.n);
    if(n==="den")return Rq(z.d);
    if(n==="gcd"||n==="lcm"){
      const b=a[1];
      if(z.d!==1n||b.d!==1n)throw new CalcError("domínio","“"+n+"” exige inteiros",p);
      const g=gcdB(z.n,b.n);
      if(n==="gcd")return Rq(g);
      return Rq(g===0n?0n:(z.n*b.n<0n?-z.n*b.n:z.n*b.n)/g);
    }
    throw new CalcError("sintaxe","Função “"+n+"” não disponível no modo ℚ",p);
  },
  show(q){
    if(q.d===1n){st.info="";return q.n.toString()}
    const neg=q.n<0n,an=neg?-q.n:q.n,w=an/q.d,r=an%q.d;
    const fr=(r*10n**15n/q.d).toString().padStart(15,"0").replace(/0+$/,"");
    st.info="≈ "+(neg?"-":"")+w+(fr?"."+fr:"")+(w>0n?" · misto: "+(neg?"-":"")+w+" "+r+"/"+q.d:"");
    return q.n+"/"+q.d;
  }
};
function evalAny(src){
  if(st.num==="C")return {r:CX.show(evalAlg(src,CX))};
  if(st.num==="Q")return {r:QA.show(evalAlg(src,QA))};
  if(st.num==="D"){
    const d=evalAlg(src,DA),r=DA.show(d),sd=DA.str(d),v=Number(sd);
    return Number.isFinite(v)?{r,d:sd,v}:{r,d:sd};
  }
  const v=evaluate(src);
  return {r:fmt(v),v};
}
