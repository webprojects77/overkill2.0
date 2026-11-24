const $=s=>document.querySelector(s);
const st={mode:"DEG",prec:12,hist:[],ans:0,num:"R",dd:50,dans:"",vars:Object.create(null),fns:Object.create(null),info:""};
class CalcError extends Error{constructor(kind,msg,pos){super(msg);this.kind=kind;this.pos=pos}}
const dom=(m,p)=>new CalcError("domínio",m,p);
function errText(e){
  if(e instanceof CalcError)return "Erro de "+e.kind+": "+e.message;
  if(typeof console!=="undefined")console.error(e);
  return "Erro interno ("+(e&&e.name?e.name:"desconhecido")+"): "+(e&&e.message?e.message:String(e))+". Se puder, avise o autor.";
}
async function copyText(v){
  try{if(typeof navigator!=="undefined"&&navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(v);return true}}catch(e){}
  try{
    const t=document.createElement("textarea");
    t.value=v;t.setAttribute("readonly","");t.style.position="fixed";t.style.opacity="0";
    document.body.append(t);t.select();
    const ok=document.execCommand("copy");t.remove();return ok;
  }catch(e){return false}
}

const rad=x=>st.mode==="DEG"?x*Math.PI/180:x;
const deg=x=>st.mode==="DEG"?x*180/Math.PI:x;
const z=x=>Math.abs(x)<1e-15?0:x;
function fact(n){if(!Number.isInteger(n)||n<0)throw dom("Fatorial exige inteiro não negativo");if(n>170)throw new CalcError("numérico","Fatorial acima de 170 excede o limite");let r=1;for(let i=2;i<=n;i++)r*=i;return r}
const FN={
sin:[1,x=>z(Math.sin(rad(x)))],cos:[1,x=>z(Math.cos(rad(x)))],
tan:[1,x=>{const c=Math.cos(rad(x));if(Math.abs(c)<1e-15)throw dom("Tangente indefinida neste ângulo");return z(Math.sin(rad(x))/c)}],
asin:[1,x=>{if(x<-1||x>1)throw dom("asin exige valor entre −1 e 1");return deg(Math.asin(x))}],
acos:[1,x=>{if(x<-1||x>1)throw dom("acos exige valor entre −1 e 1");return deg(Math.acos(x))}],
atan:[1,x=>deg(Math.atan(x))],
sinh:[1,Math.sinh],cosh:[1,Math.cosh],tanh:[1,Math.tanh],
sqrt:[1,x=>{if(x<0)throw dom("Raiz quadrada de número negativo");return Math.sqrt(x)}],
cbrt:[1,Math.cbrt],
ln:[1,x=>{if(x<=0)throw dom("Logaritmo exige valor positivo");return Math.log(x)}],
log:[1,x=>{if(x<=0)throw dom("Logaritmo exige valor positivo");return z(Math.log10(x))}],
log2:[1,x=>{if(x<=0)throw dom("Logaritmo exige valor positivo");return Math.log2(x)}],
exp:[1,Math.exp],abs:[1,Math.abs],floor:[1,Math.floor],ceil:[1,Math.ceil],round:[1,Math.round],trunc:[1,Math.trunc],
fact:[1,fact],mod:[2,(a,b)=>{if(b===0)throw dom("Módulo por zero");return a-b*Math.floor(a/b)}],
pow:[2,Math.pow],min:["v",Math.min],max:["v",Math.max]
};
const CONST={pi:Math.PI,e:Math.E,phi:(1+Math.sqrt(5))/2,tau:2*Math.PI};

function tokenize(s){
  s=s.trimEnd();
  const re=/\s*(?:(\d+\.?\d*(?:[eE][+-]?\d+)?|\.\d+(?:[eE][+-]?\d+)?)|([A-Za-z_][A-Za-z0-9_]*)|([πτ√])|(.))/gy;
  const out=[];let m;
  while(re.lastIndex<s.length&&(m=re.exec(s))){
    const txt=m[1]||m[2]||m[3]||m[4];const p=m.index+m[0].length-txt.length;
    if(m[1])out.push({t:"num",v:parseFloat(m[1]),s:m[1],p});
    else if(m[2])out.push({t:"id",v:m[2].toLowerCase(),p});
    else if(m[3])out.push({t:"id",v:{"π":"pi","τ":"tau","√":"sqrt"}[m[3]],p});
    else{
      const map={"×":"*","÷":"/","−":"-","–":"-",";":","};const c=map[m[4]]||m[4];
      if(!"+-*/^!%(),".includes(c))throw new CalcError("sintaxe","Caractere inesperado “"+m[4]+"”",p);
      out.push({t:"op",v:c,p});
    }
  }
  if(re.lastIndex<s.length&&!m)throw new CalcError("sintaxe","Caractere inesperado",re.lastIndex);
  return out;
}

function evaluate(src,scope,depth){
  scope=scope||Object.create(null);depth=depth||0;
  const t=tokenize(src);let i=0;const end=src.trimEnd().length;
  const peek=()=>t[i],next=()=>t[i++];
  const isOp=(v)=>peek()&&peek().t==="op"&&peek().v===v;
  const fin=x=>{if(!Number.isFinite(x))throw new CalcError("numérico","Resultado fora do intervalo representável",peek()?peek().p:end);return x};
  function expr(){let l=term();while(isOp("+")||isOp("-")){const o=next().v;const r=term();l=o==="+"?l+r:l-r}return fin(l)}
  function term(){
    let l=unary();
    for(;;){
      const k=peek();if(!k)break;
      if(k.t==="op"&&(k.v==="*"||k.v==="/")){
        next();const r=unary();
        if(k.v==="/"){if(r===0)throw dom("Divisão por zero",k.p);l=l/r}else l=l*r;
      }else if(k.t==="num"||k.t==="id"||(k.t==="op"&&k.v==="(")){l=l*power()}
      else break;
    }
    return fin(l);
  }
  function unary(){
    if(isOp("-")){next();return -unary()}
    if(isOp("+")){next();return unary()}
    return power();
  }
  function power(){
    const b=postfix();
    if(isOp("^")){const k=next();const e=unary();
      if(b<0&&!Number.isInteger(e))throw dom("Potência fracionária de base negativa",k.p);
      if(b===0&&e<0)throw dom("Zero elevado a expoente negativo",k.p);
      return fin(Math.pow(b,e));}
    return b;
  }
  function postfix(){
    let v=primary();
    while(isOp("!")||isOp("%")){const k=next();v=k.v==="!"?fact2(v,k.p):v/100}
    return v;
  }
  function fact2(v,p){try{return fact(v)}catch(e){e.pos=p;throw e}}
  function primary(){
    const k=next();
    if(!k)throw new CalcError("sintaxe","Expressão incompleta",end);
    if(k.t==="num")return k.v;
    if(k.t==="op"&&k.v==="("){const v=expr();if(!isOp(")"))throw new CalcError("sintaxe","Faltou fechar o parêntese",peek()?peek().p:end);next();return v}
    if(k.t==="id"){
      if(k.v==="ans")return st.ans;
      if(k.v==="solve"&&isOp("(")){
        next();const n=next();
        if(!n||n.t!=="id"||!(n.v in st.fns)||st.fns[n.v].p.length!==1)throw new CalcError("sintaxe","solve exige o nome de uma fórmula com um parâmetro, como f(x)",n?n.p:k.p);
        const nums=[];while(isOp(",")){next();nums.push(expr())}
        if(!isOp(")"))throw new CalcError("sintaxe","Faltou fechar o parêntese",peek()?peek().p:end);
        next();
        if(nums.length<1||nums.length>2)throw new CalcError("sintaxe","Use solve(f, chute) ou solve(f, a, b)",k.p);
        try{return fin(solveRoot(n.v,nums[0],nums[1],depth))}catch(e){if(e instanceof CalcError&&e.pos===undefined)e.pos=k.p;throw e}
      }
      if(k.v in st.fns&&isOp("(")){
        next();const args=[];
        if(!isOp(")")){args.push(expr());while(isOp(",")){next();args.push(expr())}}
        if(!isOp(")"))throw new CalcError("sintaxe","Faltou fechar o parêntese",peek()?peek().p:end);
        next();
        try{return fin(callUser(k.v,args,depth+1))}catch(e){if(e instanceof CalcError&&e.pos===undefined)e.pos=k.p;throw e}
      }
      if(k.v in scope)return scope[k.v];
      if(k.v in st.vars)return st.vars[k.v];
      if(Object.hasOwn(CONST,k.v)&&!isOp("("))return CONST[k.v];
      const f=Object.hasOwn(FN,k.v)?FN[k.v]:undefined;
      if(!f)throw new CalcError("sintaxe","Nome desconhecido “"+k.v+"”",k.p);
      let args=[];
      if(isOp("(")){
        next();
        if(!isOp(")")){args.push(expr());while(isOp(",")){next();args.push(expr())}}
        if(!isOp(")"))throw new CalcError("sintaxe","Faltou fechar o parêntese",peek()?peek().p:end);
        next();
      }else if(f[0]===1){args=[power()]}
      else throw new CalcError("sintaxe","Função “"+k.v+"” exige parênteses",k.p);
      if(f[0]!=="v"&&args.length!==f[0])throw new CalcError("sintaxe","“"+k.v+"” espera "+f[0]+" argumento(s)",k.p);
      if(f[0]==="v"&&!args.length)throw new CalcError("sintaxe","“"+k.v+"” exige ao menos um argumento",k.p);
      try{return fin(f[1](...args))}catch(e){if(e instanceof CalcError&&e.pos===undefined)e.pos=k.p;throw e}
    }
    throw new CalcError("sintaxe","Símbolo inesperado “"+k.v+"”",k.p);
  }
  if(!t.length)throw new CalcError("sintaxe","Expressão vazia",0);
  const v=expr();
  if(i<t.length)throw new CalcError("sintaxe","Símbolo inesperado “"+t[i].v+"”",t[i].p);
  return v;
}

function callUser(name,args,depth){
  const f=st.fns[name];
  if(args.length!==f.p.length)throw new CalcError("sintaxe","“"+name+"” espera "+f.p.length+" argumento(s)");
  if(depth>=40)throw new CalcError("numérico","Recursão profunda demais em “"+name+"”");
  const sc=Object.create(null);f.p.forEach((n,i)=>sc[n]=args[i]);
  try{return evaluate(f.b,sc,depth)}catch(e){if(e instanceof CalcError)throw new CalcError(e.kind,"em "+name+": "+e.message);throw e}
}
function solveRoot(name,a,b,depth){
  const g=x=>callUser(name,[x],depth+1);
  const rel=1e-12;let it=0;
  const tolOf=sx=>rel*Math.max(1,Math.abs(sx));
  const done=(m,x,extra)=>{st.info="método: "+m+(extra||"")+", iterações: "+it+", |f(x)|≈"+Math.abs(g(x)).toExponential(2)+", tolerância relativa: "+rel.toExponential(0);return x};
  if(b!==undefined){
    let lo=a,hi=b,fl=g(lo);const fh=g(hi);
    if(fl===0)return done("bisseção",lo);
    if(fh===0)return done("bisseção",hi);
    if(fl*fh>0)throw dom("f(a) e f(b) têm o mesmo sinal: sem raiz garantida no intervalo");
    while(it<300){
      it++;const mid=(lo+hi)/2,fm=g(mid);
      if(fm===0||(hi-lo)/2<=tolOf(mid))return done("bisseção",mid);
      if(fl*fm<0)hi=mid;else{lo=mid;fl=fm}
    }
    throw new CalcError("numérico","Bisseção não convergiu");
  }
  let x=a,dsym=null;
  const scale=Math.max(1,Math.abs(g(x)));
  if(typeof SY!=="undefined"){
    try{
      const fd=st.fns[name],p=fd.p[0],dn=SY.print(SY.simp(SY.d(SY.simp(SY.parse(fd.b)),p)));
      const ev=t=>{const s=Object.create(null);s[p]=t;return evaluate(dn,s,depth+1)};
      const h=1e-6*Math.max(1,Math.abs(x)),num=(g(x+h)-g(x-h))/(2*h),sym=ev(x);
      if(Number.isFinite(sym)&&Number.isFinite(num)&&Math.abs(sym-num)<=1e-4*Math.max(1,Math.abs(num)))dsym=ev;
    }catch(e){dsym=null}
  }
  const how=dsym?", derivada simbólica":", derivada numérica";
  const deriv=t=>{if(dsym)return dsym(t);const h=1e-6*Math.max(1,Math.abs(t));return (g(t+h)-g(t-h))/(2*h)};
  const mag=t=>{try{return Math.abs(g(t))}catch(e){return Infinity}};
  while(it<60){
    it++;const fx=g(x);
    if(Math.abs(fx)<=rel*scale)return done("Newton",x,how);
    const d=deriv(x);
    if(d===0||!Number.isFinite(d))throw new CalcError("numérico","Derivada nula ou indefinida; tente outro chute");
    const full=x-fx/d,m0=Math.abs(fx);
    let nx=full,ok=mag(full)<m0;
    if(!ok){
      let step=fx/d;
      for(let k=1;k<=10;k++){step/=2;const c=x-step;if(mag(c)<m0){nx=c;ok=true;break}}
    }
    if(!ok){
      if(Number.isFinite(mag(full)))nx=full;
      else if(m0<=1e-9*scale)return done("Newton",x,how);
      else throw new CalcError("numérico","Newton não conseguiu avançar a partir deste chute; tente outro chute ou um intervalo");
    }
    if(!Number.isFinite(nx))throw new CalcError("numérico","Newton divergiu; tente outro chute ou um intervalo");
    if(Math.abs(nx-x)<=tolOf(x))return done("Newton",nx,how);
    x=nx;
  }
  throw new CalcError("numérico","Newton não convergiu em 60 iterações; tente outro chute ou um intervalo");
}
const reserved=n=>Object.hasOwn(FN,n)||Object.hasOwn(CONST,n)||n==="ans"||n==="solve";
function execute(src){
  st.info="";
  if(st.num==="D"){const o=evalAny(src);st.dans=o.d;return o}
  if(st.num!=="R")return evalAny(src);
  const at=(body,off)=>{try{return evaluate(body)}catch(e){if(e instanceof CalcError&&e.pos!==undefined)e.pos+=off;throw e}};
  let m=src.match(/^\s*([A-Za-z_]\w*)\s*\(\s*([A-Za-z_]\w*(?:\s*,\s*[A-Za-z_]\w*)*)\s*\)\s*=(?!=)\s*(.+)$/);
  if(m){
    const name=m[1].toLowerCase(),p=m[2].split(/\s*,\s*/).map(x=>x.toLowerCase()),b=m[3].trim();
    if(reserved(name))throw new CalcError("sintaxe","“"+name+"” é um nome reservado",0);
    if(new Set(p).size!==p.length||p.some(reserved))throw new CalcError("sintaxe","Parâmetros inválidos ou repetidos",0);
    const probe=Object.create(null);p.forEach(n=>probe[n]=1);
    try{evaluate(b,probe,0)}catch(e){
      if(!(e instanceof CalcError)||e.kind==="sintaxe"){if(e instanceof CalcError&&e.pos!==undefined)e.pos+=src.length-m[3].length;throw e}
    }
    st.fns[name]={p,b};
    return {r:name+"("+p.join(", ")+") definida"};
  }
  m=src.match(/^\s*([A-Za-z_]\w*)\s*=(?!=)\s*(.+)$/);
  if(m){
    const nm=m[1].toLowerCase();
    if(reserved(nm))throw new CalcError("sintaxe","“"+nm+"” é um nome reservado",0);
    const v=at(m[2],src.length-m[2].length);
    st.vars[nm]=v;
    return {r:nm+" = "+fmt(v),v};
  }
  return evalAny(src);
}
function fmt(x){
  if(Object.is(x,-0))x=0;
  if(Number.isInteger(x)&&Math.abs(x)<1e15)return String(x);
  const n=parseFloat(x.toPrecision(st.prec));
  const a=Math.abs(n);
  if(a>=1e15||(a>0&&a<1e-6))return n.toExponential(Math.max(0,st.prec-1)).replace(/\.?0+e/,"e");
  return String(n);
}

