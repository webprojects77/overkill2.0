const DD_OPTS=[30,50,100,200,500];
let XW=0;
const W=()=>st.dd+12+XW;
const P10=new Map();
const p10=n=>{let v=P10.get(n);if(v===undefined){v=10n**BigInt(n);if(P10.size>600)P10.clear();P10.set(n,v)}return v};
const bAbs=n=>n<0n?-n:n;
const ndig=m=>bAbs(m).toString().length;
function divR(n,d){
  if(d<0n){n=-n;d=-d}
  const q=n/d,r=n%d;
  if(r===0n)return q;
  return (r<0n?-r:r)*2n>=d?(n<0n?q-1n:q+1n):q;
}
const ZERO={m:0n,e:0},ONE={m:1n,e:0},TWO={m:2n,e:0};
const domD=(m,p)=>new CalcError("domínio",m,p);
function dn(m,e){
  if(m===0n)return ZERO;
  const nd=ndig(m),w=W();
  if(nd>w){const k=nd-w;m=divR(m,p10(k));e+=k}
  while(m%10n===0n){m/=10n;e++}
  if(e>1e9||e+ndig(m)<-1e9)throw new CalcError("numérico","Resultado fora do intervalo representável",0);
  return {m,e};
}
const mag=d=>d.m===0n?-Infinity:d.e+ndig(d.m);
const sgn=d=>d.m>0n?1:d.m<0n?-1:0;
const dneg=a=>({m:-a.m,e:a.e});
function dadd(a,b){
  if(a.m===0n)return b;
  if(b.m===0n)return a;
  const w=W(),ma=mag(a),mb=mag(b);
  if(ma-mb>w+3)return a;
  if(mb-ma>w+3)return b;
  const e=Math.min(a.e,b.e);
  return dn(a.m*p10(a.e-e)+b.m*p10(b.e-e),e);
}
const dsub=(a,b)=>dadd(a,dneg(b));
const dmul=(a,b)=>dn(a.m*b.m,a.e+b.e);
function ddiv(a,b,p){
  if(b.m===0n)throw domD("Divisão por zero",p);
  if(a.m===0n)return ZERO;
  const k=W()+ndig(b.m)+3;
  return dn(divR(a.m*p10(k),b.m),a.e-b.e-k);
}
const cmpD=(a,b)=>sgn(dsub(a,b));
const isIntD=d=>d.m===0n||d.e>=0;
function toBigD(d,p){
  if(d.m===0n)return 0n;
  if(d.e>1e6)throw new CalcError("numérico","Número grande demais",p);
  return d.m*p10(d.e);
}
function dparse(s,p){
  const neg=s[0]==="-";if(neg)s=s.slice(1);
  const m=/^(\d*)\.?(\d*)(?:[eE]([+-]?\d+))?$/.exec(s);
  if(!m||(m[1]+m[2])==="")throw new CalcError("sintaxe","Número inválido",p);
  const ex=m[3]?parseInt(m[3],10):0;
  if(Math.abs(ex)>100000)throw new CalcError("numérico","Expoente grande demais",p);
  const r=dn(BigInt(m[1]+m[2]),ex-m[2].length);
  return neg?dneg(r):r;
}
const fxm=(a,b,F)=>divR(a*b,p10(F));
const fxd=(a,b,F)=>divR(a*p10(F),b);
const toFx=(d,F)=>{if(d.m===0n)return 0n;const s=d.e+F;return s>=0?d.m*p10(s):divR(d.m,p10(-s))};
const fromFx=(v,F)=>dn(v,-F);
function atanInv(n,F){
  const T=p10(F),b=BigInt(n),nn=b*b;
  let t=T/b,s=t,k=1n,sg=-1n;
  for(;;){t/=nn;if(t===0n)break;k+=2n;s+=sg*(t/k);sg=-sg}
  return s;
}
function atanhInv(n,F){
  const T=p10(F),b=BigInt(n),nn=b*b;
  let t=T/b,s=t,k=1n;
  for(;;){t/=nn;if(t===0n)break;k+=2n;s+=t/k}
  return s;
}
function eSeries(F){
  const T=p10(F);let t=T,s=T;
  for(let k=1n;;k++){t/=k;if(t===0n)break;s+=t}
  return s;
}
const CC=new Map();
function konst(name,F){
  const key=name+":"+F;
  let v=CC.get(key);
  if(v!==undefined)return v;
  const G=F+10;let r;
  if(name==="pi")r=16n*atanInv(5,G)-4n*atanInv(239,G);
  else if(name==="ln2")r=2n*atanhInv(3,G);
  else if(name==="ln10")r=6n*atanhInv(3,G)+2n*atanhInv(9,G);
  else r=eSeries(G);
  v=divR(r,p10(10));
  if(CC.size>60)CC.clear();
  CC.set(key,v);
  return v;
}
const piD=()=>{const F=W()+14;return fromFx(konst("pi",F),F)};
const halfPiD=()=>ddiv(piD(),TWO);
const eD=()=>{const F=W()+14;return fromFx(konst("e",F),F)};
const toRad=x=>st.mode==="DEG"?ddiv(dmul(x,piD()),{m:18n,e:1}):x;
const fromRad=r=>st.mode==="DEG"?ddiv(dmul(r,{m:18n,e:1}),piD()):r;
function withPrec(k,f){
  const o=XW;let r;
  XW=o+k;
  try{r=f()}finally{XW=o}
  return dn(r.m,r.e);
}
function dexp(x,p){
  if(x.m===0n)return ONE;
  const mg=mag(x);
  if(mg>5)throw new CalcError("numérico","Argumento do exp fora do intervalo representável",p);
  if(mg<-(W()+5))return dadd(ONE,x);
  const F=W()+12+Math.max(0,mg),T=p10(F),l2=konst("ln2",F);
  const xf=toFx(x,F),k=divR(xf,l2),r=xf-k*l2;
  let t=T,s=T;
  for(let n=1n;;n++){t=divR(fxm(t,r,F),n);if(t===0n)break;s+=t}
  const kk=Number(k);
  return kk>=0?dn(s*(2n**BigInt(kk)),-F):dn(s*(5n**BigInt(-kk)),-F+kk);
}
function dln(x,p){
  if(x.m<=0n)throw domD("Logaritmo exige valor positivo",p);
  const dm=dsub(x,ONE);
  if(dm.m===0n)return ZERO;
  if(mag(dm)<-(W()+5))return dm;
  const F=W()+14+Math.max(0,-mag(dm)),T=p10(F);
  const nd=ndig(x.m),mg=x.e+nd;
  let xf=divR(x.m*T,p10(nd)),j=0;
  const lo=T*3n/4n;
  while(xf<lo){xf*=2n;j++}
  const z=fxd(xf-T,xf+T,F),z2=fxm(z,z,F);
  let t=z,s=z;
  for(let k=3n;;k+=2n){t=fxm(t,z2,F);if(t===0n)break;s+=divR(t,k)}
  const res=2n*s-BigInt(j)*konst("ln2",F)+BigInt(mg)*konst("ln10",F);
  return fromFx(res,F);
}
function dsqrt(x,p){
  if(x.m<0n)throw domD("Raiz quadrada de número negativo",p);
  if(x.m===0n)return ZERO;
  const nd=ndig(x.m),w=W();
  let s=Math.max(0,2*w+4-nd);
  if((x.e-s)%2!==0)s++;
  return dn(isqrt(x.m*p10(s)),(x.e-s)/2);
}
function dpow(a,b,p){
  if(b.m===0n)return ONE;
  if(a.m===0n){
    if(b.m>0n)return ZERO;
    throw domD("Zero elevado a expoente negativo",p);
  }
  if(isIntD(b)){
    if(mag(b)>10)throw new CalcError("numérico","Expoente grande demais",p);
    const n=Number(toBigD(b,p));
    let k=Math.abs(n),r=ONE,base=a;
    while(k>0){
      if(k%2===1)r=dmul(r,base);
      k=Math.floor(k/2);
      if(k>0)base=dmul(base,base);
    }
    return n<0?ddiv(ONE,r,p):r;
  }
  if(a.m<0n)throw domD("Potência fracionária de base negativa",p);
  return dexp(dmul(b,dln(a,p)),p);
}
function dint(x,mode){
  if(x.e>=0)return x;
  const k=p10(-x.e),q=x.m/k,r=x.m%k;
  let n=q;
  if(mode==="floor"&&r<0n)n=q-1n;
  else if(mode==="ceil"&&r>0n)n=q+1n;
  return dn(n,0);
}
const droundD=x=>dint(dadd(x,{m:5n,e:-1}),"floor");
function sincosRad(xr){
  const mg=mag(xr);
  if(mg>40)throw new CalcError("numérico","Ângulo grande demais",0);
  const F=W()+14+Math.max(0,-mg)+Math.max(0,mg),T=p10(F);
  const xf=toFx(xr,F),hp=divR(konst("pi",F),2n),q=divR(xf,hp);
  let r=xf-q*hp;
  if(q!==0n&&bAbs(r)<p10(F-W()+4))r=0n;
  const r2=fxm(r,r,F);
  let ts=r,s=r,tc=T,c=T;
  for(let n=1n;;n++){
    ts=-divR(fxm(ts,r2,F),(2n*n)*(2n*n+1n));
    tc=-divR(fxm(tc,r2,F),(2n*n-1n)*(2n*n));
    if(ts===0n&&tc===0n)break;
    s+=ts;c+=tc;
  }
  const qm=Number(((q%4n)+4n)%4n);
  const pick=[[s,c],[c,-s],[-s,-c],[-c,s]][qm];
  return {s:fromFx(pick[0],F),c:fromFx(pick[1],F)};
}
const trigBoost=x=>Math.max(0,mag(x))+2;
function dsin(x){
  if(x.m===0n)return ZERO;
  return withPrec(trigBoost(x),()=>{const xr=toRad(x);return mag(xr)<-(W()+5)?xr:sincosRad(xr).s});
}
function dcos(x){
  if(x.m===0n)return ONE;
  return withPrec(trigBoost(x),()=>{const xr=toRad(x);return mag(xr)<-(W()+5)?ONE:sincosRad(xr).c});
}
function dtan(x,p){
  if(x.m===0n)return ZERO;
  return withPrec(trigBoost(x),()=>{
    const xr=toRad(x);
    if(mag(xr)<-(W()+5))return xr;
    const o=sincosRad(xr);
    if(o.c.m===0n)throw domD("Tangente indefinida neste ângulo",p);
    return ddiv(o.s,o.c,p);
  });
}
function atanFx(y,F){
  const T=p10(F);
  for(let i=0;i<4;i++){const s=isqrt(T*T+y*y);y=fxd(y,T+s,F)}
  const y2=fxm(y,y,F);
  let t=y,sum=y;
  for(let k=3n;;k+=2n){t=-fxm(t,y2,F);const q=divR(t,k);if(q===0n)break;sum+=q}
  return sum*16n;
}
function atanRad(x){
  if(x.m===0n)return ZERO;
  const neg=x.m<0n,ax=neg?dneg(x):x,mg=mag(ax);
  if(mg<-(W()+5))return x;
  const F=W()+14+Math.max(0,-mg),T=p10(F);
  const axf=toFx(ax,F);
  let res;
  if(axf>T)res=divR(konst("pi",F),2n)-atanFx(fxd(T,axf,F),F);
  else res=atanFx(axf,F);
  const out=fromFx(res,F);
  return neg?dneg(out):out;
}
function asinRad(x,name,p){
  const s=sgn(x),ax=s<0?dneg(x):x,c=cmpD(ax,ONE);
  if(c>0)throw domD(name+" exige valor entre −1 e 1",p);
  if(c===0)return s<0?dneg(halfPiD()):halfPiD();
  if(s===0)return ZERO;
  const den=dsqrt(dsub(ONE,{m:x.m*x.m,e:2*x.e}));
  return atanRad(ddiv(x,den,p));
}
function dsinh(x,p){
  if(x.m===0n)return ZERO;
  if(mag(x)<-(W()+5))return x;
  return withPrec(Math.min(W(),Math.max(0,-mag(x)))+2,()=>ddiv(dsub(dexp(x,p),dexp(dneg(x),p)),TWO,p));
}
const dcosh=(x,p)=>ddiv(dadd(dexp(x,p),dexp(dneg(x),p)),TWO,p);
function dtanh(x,p){
  if(x.m===0n)return ZERO;
  if(mag(x)>=4)return x.m<0n?{m:-1n,e:0}:ONE;
  if(mag(x)<-(W()+5))return x;
  return withPrec(Math.min(W(),Math.max(0,-mag(x)))+2,()=>{
    const a=dexp(x,p),b=dexp(dneg(x),p);
    return ddiv(dsub(a,b),dadd(a,b),p);
  });
}
function dfact(a,p){
  if(!isIntD(a)||a.m<0n)throw domD("Fatorial exige inteiro não negativo",p);
  if(mag(a)>4||toBigD(a,p)>1000n)throw new CalcError("numérico","Fatorial acima de 1000 excede o limite",p);
  let r=1n;
  for(let k=2n;k<=toBigD(a,p);k++)r*=k;
  return dn(r,0);
}
const DA_ARITY={pow:2,mod:2,min:"v",max:"v"};
const DA={
  isConst:n=>["pi","e","tau","phi","i","ans"].includes(n),
  num(v,p,s){
    if(s!==undefined)return dparse(s,p);
    if(!Number.isFinite(v))throw new CalcError("numérico","Número fora do intervalo",p);
    return dparse(String(v),p);
  },
  add:dadd,sub:dsub,neg:dneg,mul:dmul,div:ddiv,pow:dpow,fact:dfact,
  sym(n,p){
    if(n==="pi")return piD();
    if(n==="e")return eD();
    if(n==="tau")return dmul(piD(),TWO);
    if(n==="phi")return ddiv(dadd(ONE,dsqrt({m:5n,e:0})),TWO);
    if(n==="ans")return st.dans?dparse(st.dans,p):dparse(String(st.ans),p);
    if(n in st.vars)return dparse(String(st.vars[n]),p);
    if(n==="i")throw new CalcError("domínio","“i” não é real: use o modo ℂ",p);
    throw new CalcError("sintaxe","Nome desconhecido “"+n+"”",p);
  },
  call(n,a,p){
    const ar=DA_ARITY[n]||1;
    if(ar==="v"){
      if(!a.length)throw new CalcError("sintaxe","“"+n+"” exige ao menos um argumento",p);
      return a.reduce((m,x)=>(n==="min"?cmpD(x,m)<0:cmpD(x,m)>0)?x:m);
    }
    if(a.length!==ar)throw new CalcError("sintaxe","“"+n+"” espera "+ar+" argumento(s)",p);
    const x=a[0];
    if(n==="pow")return dpow(x,a[1],p);
    if(n==="mod"){
      if(a[1].m===0n)throw domD("Módulo por zero",p);
      return dsub(x,dmul(a[1],dint(ddiv(x,a[1],p),"floor")));
    }
    if(n==="fact")return dfact(x,p);
    if(n==="sqrt")return dsqrt(x,p);
    if(n==="cbrt"){
      if(x.m===0n)return ZERO;
      const r=dexp(ddiv(dln(x.m<0n?dneg(x):x,p),{m:3n,e:0},p),p);
      return x.m<0n?dneg(r):r;
    }
    if(n==="exp")return dexp(x,p);
    if(n==="ln")return dln(x,p);
    if(n==="log")return ddiv(dln(x,p),fromFx(konst("ln10",W()+14),W()+14),p);
    if(n==="log2")return ddiv(dln(x,p),fromFx(konst("ln2",W()+14),W()+14),p);
    if(n==="sin")return dsin(x);
    if(n==="cos")return dcos(x);
    if(n==="tan")return dtan(x,p);
    if(n==="asin")return fromRad(asinRad(x,"asin",p));
    if(n==="acos")return fromRad(dsub(halfPiD(),asinRad(x,"acos",p)));
    if(n==="atan")return fromRad(atanRad(x));
    if(n==="sinh")return dsinh(x,p);
    if(n==="cosh")return dcosh(x,p);
    if(n==="tanh")return dtanh(x,p);
    if(n==="abs")return {m:bAbs(x.m),e:x.e};
    if(n==="floor")return dint(x,"floor");
    if(n==="ceil")return dint(x,"ceil");
    if(n==="trunc")return dint(x,"trunc");
    if(n==="round")return droundD(x);
    throw new CalcError("sintaxe","Função “"+n+"” não disponível no modo "+(typeof lbl==="function"?lbl("Dec","Decimal"):"Decimal"),p);
  },
  str:d=>d.m+"e"+d.e,
  show(d){
    const dd=st.dd;
    st.info="decimal de "+dd+" dígitos significativos";
    let m=d.m,e=d.e;
    if(m===0n)return "0";
    const neg=m<0n;
    if(neg)m=-m;
    const nd=m.toString().length;
    if(nd>dd){m=divR(m,p10(nd-dd));e+=nd-dd}
    let s=m.toString();
    while(s.length>1&&s.endsWith("0")){s=s.slice(0,-1);e++}
    const x10=e+s.length-1;
    let out;
    if(x10>=-7&&x10<Math.max(21,dd)){
      if(e>=0)out=s+"0".repeat(e);
      else if(-e>=s.length)out="0."+"0".repeat(-e-s.length)+s;
      else out=s.slice(0,s.length+e)+"."+s.slice(s.length+e);
    }else out=s[0]+(s.length>1?"."+s.slice(1):"")+"e"+x10;
    return (neg?"-":"")+out;
  }
};
