const divs=n=>{const r=[];for(let i=1;i*i<=n;i++)if(n%i===0){r.push(i);if(i*i!==n)r.push(n/i)}return r};
const gcdN=(a,b)=>{while(b)[a,b]=[b,a%b];return a};
const PL={
  cst:c=>c.n===0n?new Map():new Map([["",{c,m:{}}]]),
  key:m=>Object.keys(m).filter(k=>m[k]).sort().map(k=>k+"^"+m[k]).join("*"),
  clean(r){for(const [k,t] of r)if(t.c.n===0n)r.delete(k);return r},
  add(a,b,s=1){
    const r=new Map(a);
    for(const [k,t] of b){const c=s===1?t.c:QA.neg(t.c),e=r.get(k);r.set(k,{c:e?QA.add(e.c,c):c,m:t.m})}
    return PL.clean(r);
  },
  mul(a,b){
    const r=new Map();
    for(const ta of a.values())for(const tb of b.values()){
      const m={...ta.m};for(const k in tb.m)m[k]=(m[k]||0)+tb.m[k];
      const key=PL.key(m),c=QA.mul(ta.c,tb.c),e=r.get(key);
      r.set(key,{c:e?QA.add(e.c,c):c,m});
      if(r.size>5000)throw new CalcError("numérico","Polinômio grande demais",0);
    }
    return PL.clean(r);
  },
  bad:()=>new CalcError("domínio","Não é um polinômio: há divisão por variável, expoente que não é inteiro não negativo ou outra forma sem suporte",0),
  fromNode(n){
    if(n.t==="num")return PL.cst(QA.num(n.v,0));
    if(n.t==="var")return new Map([[n.n+"^1",{c:Rq(1n),m:{[n.n]:1}}]]);
    if(n.t==="neg")return PL.mul(PL.fromNode(n.a),PL.cst(Rq(-1n)));
    if(n.t==="fn"){const s=SY.print(n);return new Map([[s+"^1",{c:Rq(1n),m:{[s]:1}}]])}
    const a=PL.fromNode(n.a),b=PL.fromNode(n.b);
    if(n.op==="+")return PL.add(a,b);
    if(n.op==="-")return PL.add(a,b,-1);
    if(n.op==="*")return PL.mul(a,b);
    const isC=p=>p.size===0||(p.size===1&&p.has(""));
    if(n.op==="/"){
      if(!isC(b)||b.size===0)throw PL.bad();
      const q=b.get("").c;return PL.mul(a,PL.cst(Rq(q.d,q.n)));
    }
    if(!isC(b)||b.size===0)throw PL.bad();
    const e=b.get("").c;
    if(e.d!==1n||e.n<0n||e.n>64n)throw PL.bad();
    let r=PL.cst(Rq(1n));for(let i=0n;i<e.n;i++)r=PL.mul(r,a);
    return r;
  },
  print(p,v){
    if(!p.size)return "0";
    const deg=t=>t.m[v]||0,tot=t=>Object.values(t.m).reduce((s,e)=>s+e,0),mk=t=>PL.key(t.m);
    const ts=[...p.values()].sort((a,b)=>deg(b)-deg(a)||tot(b)-tot(a)||(mk(a)<mk(b)?-1:1));
    return ts.map((t,i)=>{
      const neg=t.c.n<0n,an=neg?-t.c.n:t.c.n;
      const mono=Object.keys(t.m).filter(k=>t.m[k]).sort().map(k=>k+(t.m[k]>1?"^"+t.m[k]:"")).join("*");
      let body;
      if(!mono)body=t.c.d===1n?String(an):an+"/"+t.c.d;
      else if(an===1n&&t.c.d===1n)body=mono;
      else body=(t.c.d===1n?String(an):"("+an+"/"+t.c.d+")")+(/^[a-df-zA-Z(]/.test(mono)?"":"*")+mono;
      return i===0?(neg?"-":"")+body:(neg?" - ":" + ")+body;
    }).join("");
  },
  mainVar(p,pref){
    const vs=new Set();for(const t of p.values())for(const k in t.m)if(t.m[k])vs.add(k);
    return pref&&vs.has(pref)?pref:[...vs].sort()[0]||"x";
  },
  divLin(a,p,q){
    const n=a.length-1,b=[];let carry=0n;
    for(let i=0;i<n;i++){const cur=a[i]+carry;if(cur%q!==0n)return null;const bi=cur/q;b.push(bi);carry=bi*p}
    return a[n]+carry===0n?b:null;
  },
  expand(src,pref){
    const p=PL.fromNode(SY.parse(src)),v=PL.mainVar(p,pref),text=PL.print(p,v);
    return {text,v,checked:agree(src,text,v)};
  },
  factor(src){
    const p=PL.fromNode(SY.parse(src)),vs=new Set();
    for(const t of p.values())for(const k in t.m)if(t.m[k])vs.add(k);
    if(!vs.size)return {text:PL.print(p,"x"),notes:["constante: nada a fatorar"],exact:true,checked:0,v:"x"};
    if(vs.size>1||![...vs].every(k=>/^[A-Za-z_]\w*$/.test(k)))throw new CalcError("domínio","A fatoração suporta polinômios de uma variável simples",0);
    const v=[...vs][0],deg=Math.max(...[...p.values()].map(t=>t.m[v]||0));
    const cs=Array.from({length:deg+1},()=>Rq(0n));
    for(const t of p.values())cs[t.m[v]||0]=t.c;
    let L=1n;for(const c of cs)L=L*c.d/gcdB(L,c.d);
    let a=cs.map(c=>c.n*(L/c.d)).reverse();
    const orig=a.slice();
    let g=0n;for(const c of a)g=gcdB(g,c);
    const sign=a[0]<0n?-1n:1n;
    a=a.map(c=>c/(g*sign));
    let k=0;while(a.length>1&&a[a.length-1]===0n){a.pop();k++}
    const facs=[],notes=[];
    const addF=f=>{const key=f.join(",");const e=facs.find(x=>x.key===key);if(e)e.m++;else facs.push({key,a:f,m:1})};
    for(let guard=0;a.length>2&&guard<60;guard++){
      const an=a[0],a0=a[a.length-1]<0n?-a[a.length-1]:a[a.length-1];
      if(an>10n**12n||a0>10n**12n){notes.push("coeficientes grandes: busca de raízes racionais omitida");break}
      const ps=divs(Number(a0)),qs=divs(Number(an));
      if(ps.length*qs.length>2e5){notes.push("candidatos demais: busca de raízes racionais omitida");break}
      let f=null;
      search:for(const q of qs)for(const pp of ps){
        if(gcdN(pp,q)!==1)continue;
        for(const sg of [1,-1]){const P=BigInt(sg*pp),Q=BigInt(q),b=PL.divLin(a,P,Q);if(b){f={P,Q,b};break search}}
      }
      if(!f)break;
      addF([f.Q,-f.P]);a=f.b;
    }
    let rem=null;
    if(a.length===2)addF(a);else if(a.length>2)rem=a;
    facs.sort((x,y)=>(x.a.length===2?Number(-x.a[1])/Number(x.a[0]):1e300)-(y.a.length===2?Number(-y.a[1])/Number(y.a[0]):1e300));
    const mulI=(x,y)=>{const r=Array(x.length+y.length-1).fill(0n);x.forEach((u,i)=>y.forEach((w,j)=>{r[i+j]+=u*w}));return r};
    let prod=[sign*g];
    for(const f of facs)for(let i=0;i<f.m;i++)prod=mulI(prod,f.a);
    if(rem)prod=mulI(prod,rem);
    for(let i=0;i<k;i++)prod.push(0n);
    const exact=prod.length===orig.length&&prod.every((c,i)=>c===orig[i]);
    const fp=arr=>{const m=new Map();arr.forEach((c,i)=>{const e=arr.length-1-i;if(c!==0n)m.set(v+"^"+e,{c:Rq(c),m:e?{[v]:e}:{}})});return PL.print(m,v)};
    const parts=[];
    if(k)parts.push(v+(k>1?"^"+k:""));
    facs.forEach(f=>parts.push("("+fp(f.a)+")"+(f.m>1?"^"+f.m:"")));
    if(rem){
      parts.push("("+fp(rem)+")");
      notes.push(rem.length<=4?"o último fator não tem raízes racionais: é irredutível sobre ℚ":"o último fator não tem raízes racionais, mas ainda pode fatorar em polinômios de grau maior (a busca cobre só raízes racionais)");
    }
    const s=Rq(sign*g,L),sstr=s.d===1n?(s.n===1n?"":s.n===-1n?"-":String(s.n)):"("+s.n+"/"+s.d+")";
    const text=sstr+parts.join("");
    return {text,notes,exact,v,checked:agree(src,text,v)};
  }
};
function freeVars(n,s=new Set()){
  if(n.t==="var")s.add(n.n);
  else if(n.t==="bin"){freeVars(n.a,s);freeVars(n.b,s)}
  else if(n.t==="neg"||n.t==="fn")freeVars(n.a,s);
  return s;
}
function agree(s1,s2,main){
  const old=st.mode;st.mode="RAD";
  try{
    const names=[...new Set([...freeVars(SY.parse(s1)),...freeVars(SY.parse(s2))])].filter(k=>!["pi","e","tau","phi"].includes(k)).sort();
    const xs=[0.31,0.77,1.23,1.9,2.4,-0.45,-1.3];let ok=0;
    for(const x0 of xs){
      const sc=Object.create(null);names.forEach((k,j)=>{sc[k]=k===main?x0:1.7+0.3*j});
      let a,b;
      try{a=evaluate(s1,sc);b=evaluate(s2,sc)}catch(e){continue}
      if(!Number.isFinite(a)||!Number.isFinite(b))continue;
      if(Math.abs(a-b)>1e-6*Math.max(1,Math.abs(a)))return -1;
      ok++;
    }
    return ok;
  }finally{st.mode=old}
}
const IG={
  N:v=>({t:"num",v}),
  B:(op,a,b)=>({t:"bin",op,a,b}),
  M:(a,b)=>IG.B("*",a,b),
  S:(f,a)=>({t:"fn",n:f,a}),
  neg:a=>({t:"neg",a}),
  ratio:q=>q.d===1n?IG.N(Number(q.n)):IG.B("/",IG.N(Number(q.n)),IG.N(Number(q.d))),
  scaled(F,a){
    if(a.n===1n&&a.d===1n)return F;
    if(a.n<0n)return IG.neg(IG.scaled(F,QA.neg(a)));
    return a.d===1n?IG.B("/",F,IG.N(Number(a.n))):IG.M(IG.ratio(Rq(a.d,a.n)),F);
  },
  fnX(n,x){
    if(n.t==="fn")return SY.has(n,x);
    if(n.t==="bin")return IG.fnX(n.a,x)||IG.fnX(n.b,x);
    if(n.t==="neg")return IG.fnX(n.a,x);
    return false;
  },
  lin(arg,x){
    if(!SY.has(arg,x))return null;
    let p;try{p=PL.fromNode(arg)}catch(e){return null}
    let a=Rq(0n),b=Rq(0n);
    for(const t of p.values()){
      const ks=Object.keys(t.m).filter(k=>t.m[k]);
      if(!ks.length)b=t.c;
      else if(ks.length===1&&ks[0]===x&&t.m[x]===1)a=t.c;
      else return null;
    }
    return a.n===0n?null:{a,b};
  },
  logTerm:(u,l,x)=>IG.scaled(IG.S("ln",IG.S("abs",u)),l.a),
  seq:{
    sin:[[-1,"cos"],[-1,"sin"],[1,"cos"],[1,"sin"]],cos:[[1,"sin"],[-1,"cos"],[-1,"sin"],[1,"cos"]],
    exp:[[1,"exp"]],sinh:[[1,"cosh"],[1,"sinh"]],cosh:[[1,"sinh"],[1,"cosh"]]
  },
  go(n,x){
    const {B,M,S,neg}=IG,V={t:"var",n:x};
    if(!SY.has(n,x))return M(n,V);
    if(!IG.fnX(n,x)){
      let p=null;try{p=PL.fromNode(n)}catch(e){}
      if(p){
        const r=new Map();
        for(const t of p.values()){
          const e=t.m[x]||0,m={...t.m,[x]:e+1},c=QA.div(t.c,Rq(BigInt(e+1)),0);
          r.set(PL.key(m),{c,m});
        }
        return SY.parse(PL.print(r,x));
      }
    }
    if(n.t==="neg")return neg(IG.go(n.a,x));
    if(n.t==="bin"&&(n.op==="+"||n.op==="-"))return B(n.op,IG.go(n.a,x),IG.go(n.b,x));
    if(n.t==="bin"&&n.op==="*"){
      if(!SY.has(n.a,x))return M(n.a,IG.go(n.b,x));
      if(!SY.has(n.b,x))return M(n.b,IG.go(n.a,x));
      const fs=[];const flat=m=>{if(m.t==="bin"&&m.op==="*"){flat(m.a);flat(m.b)}else fs.push(m)};flat(n);
      const gi=fs.findIndex(f=>f.t==="fn"&&Object.hasOwn(IG.seq,f.n)&&IG.lin(f.a,x));
      if(gi>=0){
        const rest=fs.filter((_,i)=>i!==gi),P=rest.reduce((p,f)=>M(p,f)),g=fs[gi],l=IG.lin(g.a,x);
        let pp=null;if(!rest.some(f=>IG.fnX(f,x)))try{pp=PL.fromNode(P)}catch(e){}
        if(pp){
          const deg=Math.max(...[...pp.values()].map(t=>t.m[x]||0));
          if(deg>10)throw new CalcError("numérico","Grau alto demais para a integração por partes",0);
          let Pk=SY.simp(P),sum=null;
          for(let k=0;k<=deg&&SY.print(Pk)!=="0";k++){
            const [s0,h]=IG.seq[g.n][k%IG.seq[g.n].length],sg=(k%2?-1:1)*s0;
            const Gk=IG.scaled(S(h,g.a),QA.pow(l.a,{n:BigInt(k+1),d:1n},0)),term=M(Pk,Gk);
            sum=sum===null?(sg<0?neg(term):term):B(sg<0?"-":"+",sum,term);
            Pk=SY.simp(SY.d(Pk,x));
          }
          return sum;
        }
      }
    }
    if(n.t==="bin"&&n.op==="/"){
      if(!SY.has(n.b,x))return B("/",IG.go(n.a,x),n.b);
      const l=IG.lin(n.b,x);
      if(!SY.has(n.a,x)&&l)return M(n.a,IG.logTerm(n.b,l,x));
    }
    if(n.t==="fn"){
      const l=IG.lin(n.a,x);
      if(l){
        if(n.n==="sqrt")return IG.go(B("^",n.a,B("/",IG.N(1),IG.N(2))),x);
        const F={sin:()=>neg(S("cos",n.a)),cos:()=>S("sin",n.a),exp:()=>S("exp",n.a),sinh:()=>S("cosh",n.a),cosh:()=>S("sinh",n.a),tan:()=>neg(S("ln",S("abs",S("cos",n.a))))}[n.n];
        if(F)return IG.scaled(F(),l.a);
      }
    }
    if(n.t==="bin"&&n.op==="^"){
      const l=IG.lin(n.a,x);
      if(l&&!SY.has(n.b,x)){
        const k=evaluate(SY.print(n.b));
        if(Number.isFinite(k)){
          if(k===-1)return IG.logTerm(n.a,l,x);
          const k1=QA.add(QA.num(k,0),Rq(1n));
          return M(IG.ratio(Rq(QA.mul(l.a,k1).d,QA.mul(l.a,k1).n)),B("^",n.a,IG.ratio(k1)));
        }
      }
      const lb=IG.lin(n.b,x);
      if(lb&&!SY.has(n.a,x)){
        if(n.a.t==="var"&&n.a.n==="e")return IG.scaled(n,lb.a);
        return IG.scaled(B("/",n,S("ln",n.a)),lb.a);
      }
    }
    throw new CalcError("domínio","Sem regra de integração simbólica para esta forma (isso não significa que a integral não exista)",0);
  },
  integrate(src,x,lo,hi){
    const f=SY.simp(SY.parse(src)),F=SY.simp(IG.go(f,x)),fs=SY.print(f),Fs=SY.print(F);
    const dF=SY.print(SY.simp(SY.d(F,x))),checked=agree(fs,dF,x);
    if(checked<0)throw new CalcError("numérico","Falha na verificação: a derivada do resultado não bate com a função. Não vou mostrar um resultado que não consigo confirmar",0);
    const out={f:fs,F:Fs,checked};
    if(lo!==undefined){
      const old=st.mode;st.mode="RAD";
      try{
        const at=t=>{const sc=Object.create(null);sc[x]=t;return sc},fv=t=>evaluate(fs,at(t)),Fv=t=>evaluate(Fs,at(t));
        out.def=Fv(hi)-Fv(lo);
        const N=2000,h=(hi-lo)/N;let s=fv(lo)+fv(hi);
        for(let i=1;i<N;i++)s+=fv(lo+i*h)*(i%2?4:2);
        out.num=s*h/3;
        if(!Number.isFinite(out.def)||!Number.isFinite(out.num)||Math.abs(out.def-out.num)>1e-6*Math.max(1,Math.abs(out.def)))
          throw new CalcError("domínio","A integral definida não pôde ser confirmada numericamente (possível singularidade ou descontinuidade no intervalo)",0);
      }catch(e){
        if(e instanceof CalcError)throw e;
        throw new CalcError("domínio","A integral definida não pôde ser confirmada numericamente neste intervalo",0);
      }finally{st.mode=old}
    }
    return out;
  }
};
function algebraUI(){
  const out=$("#alOut");
  const run=()=>{
    try{
      const src=$("#alIn").value,op=$("#alOp").value,v=$("#alVar").value.trim().toLowerCase()||"x";
      if(!/^[a-z_]\w*$/.test(v))throw new CalcError("sintaxe","Nome de variável inválido",0);
      const ck=n=>n<0?"":n===0?"\n(não foi possível conferir numericamente)":"\nverificado numericamente em "+n+" ponto(s)";
      if(op==="expand"){const r=PL.expand(src,v);out.textContent=r.text+ck(r.checked)}
      else if(op==="factor"){
        const r=PL.factor(src);
        out.textContent=r.text+"\n"+(r.exact?"verificado: o produto dos fatores é exatamente o polinômio original":"AVISO: o produto não bateu com o original")+r.notes.map(n=>"\n"+n).join("")+ck(r.checked);
      }else{
        const a=$("#alA").value.trim(),b=$("#alB").value.trim();
        const lo=a?evaluate(a):undefined,hi=b?evaluate(b):undefined;
        if((a&&!b)||(!a&&b))throw new CalcError("sintaxe","Informe os dois limites (de e até) ou nenhum",0);
        const r=IG.integrate(src,v,lo,hi);
        out.textContent="∫ "+r.f+" d"+v+" = "+r.F+" + C"+ck(r.checked)+(r.def===undefined?"":"\n\nintegral de "+fmt(lo)+" a "+fmt(hi)+" = "+fmt(r.def)+"\nconferência numérica (Simpson) = "+fmt(r.num));
      }
    }catch(e){out.textContent=errText(e)}
  };
  ["#alIn","#alVar","#alA","#alB"].forEach(s=>{$(s).oninput=run});
  $("#alOp").onchange=()=>{
    const o=$("#alOp").value;
    $("#alIn").value=o==="expand"?"(x+1)^3-(x-1)^2":o==="factor"?"x^3-6x^2+11x-6":"x*exp(2x)";
    run();
  };
  run();
}
if(typeof document!=="undefined"&&document.getElementById("tl"))algebraUI();
