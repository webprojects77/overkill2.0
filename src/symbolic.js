const SY={
  parse(src){
    const t=tokenize(src);let i=0;const end=src.trimEnd().length;
    const peek=()=>t[i],next=()=>t[i++];
    const isOp=v=>peek()&&peek().t==="op"&&peek().v===v;
    const bin=(op,a,b)=>({t:"bin",op,a,b});
    const close=()=>{if(!isOp(")"))throw new CalcError("sintaxe","Faltou fechar o parêntese",peek()?peek().p:end);next()};
    function expr(){let l=term();while(isOp("+")||isOp("-")){const o=next().v;l=bin(o,l,term())}return l}
    function term(){
      let l=unary();
      for(;;){
        const k=peek();if(!k)break;
        if(k.t==="op"&&(k.v==="*"||k.v==="/")){next();l=bin(k.v,l,unary())}
        else if(k.t==="num"||k.t==="id"||(k.t==="op"&&k.v==="(")){l=bin("*",l,power())}
        else break;
      }
      return l;
    }
    function unary(){
      if(isOp("-")){next();return {t:"neg",a:unary()}}
      if(isOp("+")){next();return unary()}
      return power();
    }
    function power(){const b=primary();if(isOp("^")){next();return bin("^",b,unary())}return b}
    function primary(){
      const k=next();
      if(!k)throw new CalcError("sintaxe","Expressão incompleta",end);
      if(k.t==="num")return {t:"num",v:k.v};
      if(k.t==="op"&&k.v==="("){const v=expr();close();return v}
      if(k.t==="id"){
        if(isOp("(")&&Object.hasOwn(SY.D,k.v)){next();const a=expr();close();return {t:"fn",n:k.v,a}}
        if(isOp("(")&&(Object.hasOwn(FN,k.v)||(k.v.length>1&&!Object.hasOwn(CONST,k.v))))throw new CalcError("sintaxe",Object.hasOwn(FN,k.v)?"Sem regra de derivada simbólica para “"+k.v+"”":"Função desconhecida “"+k.v+"”; para multiplicar use *",k.p);
        return {t:"var",n:k.v};
      }
      throw new CalcError("sintaxe","Símbolo inesperado “"+k.v+"”",k.p);
    }
    if(!t.length)throw new CalcError("sintaxe","Expressão vazia",0);
    const r=expr();
    if(i<t.length)throw new CalcError("sintaxe","Símbolo inesperado “"+t[i].v+"”",t[i].p);
    return r;
  },
  has(n,x){
    if(n.t==="var")return n.n===x;
    if(n.t==="num")return false;
    if(n.t==="bin")return SY.has(n.a,x)||SY.has(n.b,x);
    return SY.has(n.a,x);
  },
  d(n,x){
    const N=v=>({t:"num",v}),B=(op,a,b)=>({t:"bin",op,a,b}),M=(a,b)=>B("*",a,b),S=(f,a)=>({t:"fn",n:f,a});
    if(n.t==="num")return N(0);
    if(n.t==="var")return N(n.n===x?1:0);
    if(n.t==="neg")return {t:"neg",a:SY.d(n.a,x)};
    if(n.t==="fn")return M(SY.D[n.n](n.a),SY.d(n.a,x));
    const {op,a,b}=n,da=SY.d(a,x),db=SY.d(b,x);
    if(op==="+"||op==="-")return B(op,da,db);
    if(op==="*")return B("+",M(da,b),M(a,db));
    if(op==="/")return B("/",B("-",M(da,b),M(a,db)),B("^",b,N(2)));
    if(!SY.has(b,x))return M(M(b,B("^",a,B("-",b,N(1)))),da);
    if(!SY.has(a,x))return M(M(n,S("ln",a)),db);
    return M(n,B("+",M(db,S("ln",a)),B("/",M(b,da),a)));
  },
  step(n){
    const N=v=>({t:"num",v}),B=(op,a,b)=>({t:"bin",op,a,b}),isN=(x,v)=>x.t==="num"&&x.v===v,num=x=>x.t==="num";
    if(n.t==="num"||n.t==="var")return n;
    if(n.t==="neg"){const a=SY.step(n.a);if(num(a))return N(-a.v);if(a.t==="neg")return a.a;return {t:"neg",a}}
    if(n.t==="fn")return {t:"fn",n:n.n,a:SY.step(n.a)};
    const a=SY.step(n.a),b=SY.step(n.b),op=n.op,same=SY.print(a)===SY.print(b);
    if(num(a)&&num(b)){
      const r=op==="+"?a.v+b.v:op==="-"?a.v-b.v:op==="*"?a.v*b.v:op==="/"?a.v/b.v:Math.pow(a.v,b.v);
      if(Number.isFinite(r)&&(op==="+"||op==="-"||op==="*"||Number.isInteger(r)))return N(r);
    }
    if(op==="+"){
      if(isN(a,0))return b;if(isN(b,0))return a;
      if(same)return B("*",N(2),a);
      if(b.t==="neg")return B("-",a,b.a);
      if(a.t==="neg")return B("-",b,a.a);
    }
    if(op==="-"){
      if(isN(b,0))return a;if(isN(a,0))return {t:"neg",a:b};
      if(same)return N(0);
      if(b.t==="neg")return B("+",a,b.a);
    }
    if(op==="*"){
      if(isN(a,0)||isN(b,0))return N(0);
      if(isN(a,1))return b;if(isN(b,1))return a;
      if(isN(a,-1))return {t:"neg",a:b};if(isN(b,-1))return {t:"neg",a};
      if(a.t==="neg")return {t:"neg",a:B("*",a.a,b)};
      if(b.t==="neg")return {t:"neg",a:B("*",a,b.a)};
      if(num(b)&&!num(a))return B("*",b,a);
      if(num(a)&&b.t==="bin"&&b.op==="*"&&num(b.a))return B("*",N(a.v*b.a.v),b.b);
      if(!num(a)&&b.t==="bin"&&b.op==="*"&&num(b.a))return B("*",b.a,B("*",a,b.b));
      if(a.t==="bin"&&a.op==="*"&&num(a.a)&&!num(b))return B("*",a.a,B("*",a.b,b));
      if(same)return B("^",a,N(2));
    }
    if(op==="/"){
      if(isN(b,1))return a;if(isN(a,0))return N(0);
      if(same)return N(1);
      if(b.t==="neg")return {t:"neg",a:B("/",a,b.a)};
    }
    if(op==="^"){if(isN(b,0))return N(1);if(isN(b,1))return a;if(isN(a,1))return N(1)}
    return B(op,a,b);
  },
  simp(n){
    let cur=n,s=SY.print(n);
    for(let k=0;k<20;k++){const nx=SY.step(cur),ns=SY.print(nx);if(ns===s)return nx;cur=nx;s=ns}
    return cur;
  },
  print(n,p=0){
    if(n.t==="num"){const s=fmt(n.v);return n.v<0&&p>0?"("+s+")":s}
    if(n.t==="var")return n.n;
    if(n.t==="fn")return n.n+"("+SY.print(n.a,0)+")";
    if(n.t==="neg"){const s="-"+SY.print(n.a,3);return p>=2?"("+s+")":s}
    const prec={"+":1,"-":1,"*":2,"/":2,"^":4}[n.op];
    let s;
    if(n.op==="+")s=SY.print(n.a,1)+" + "+SY.print(n.b,1);
    else if(n.op==="-")s=SY.print(n.a,1)+" - "+SY.print(n.b,2);
    else if(n.op==="*"){
      const sa=SY.print(n.a,2),sb=SY.print(n.b,2);
      s=n.a.t==="num"&&n.a.v>0&&/^[a-df-zA-Z(]/.test(sb)?sa+sb:sa+"*"+sb;
    }
    else if(n.op==="/")s=SY.print(n.a,2)+"/"+SY.print(n.b,3);
    else s=SY.print(n.a,5)+"^"+SY.print(n.b,4);
    return prec<p?"("+s+")":s;
  }
};
(()=>{
  const N=v=>({t:"num",v}),B=(op,a,b)=>({t:"bin",op,a,b}),S=(f,a)=>({t:"fn",n:f,a}),neg=a=>({t:"neg",a}),sq=u=>B("^",u,N(2));
  const inv=(u)=>B("/",N(1),u);
  SY.D={
    sin:u=>S("cos",u),cos:u=>neg(S("sin",u)),tan:u=>inv(sq(S("cos",u))),
    asin:u=>inv(S("sqrt",B("-",N(1),sq(u)))),acos:u=>neg(inv(S("sqrt",B("-",N(1),sq(u))))),atan:u=>inv(B("+",N(1),sq(u))),
    sinh:u=>S("cosh",u),cosh:u=>S("sinh",u),tanh:u=>B("-",N(1),sq(S("tanh",u))),
    exp:u=>S("exp",u),ln:u=>inv(u),log:u=>inv(B("*",u,S("ln",N(10)))),log2:u=>inv(B("*",u,S("ln",N(2)))),
    sqrt:u=>inv(B("*",N(2),S("sqrt",u))),cbrt:u=>inv(B("*",N(3),sq(S("cbrt",u)))),abs:u=>B("/",u,S("abs",u))
  };
})();
function symbolicUI(){
  const out=$("#syOut");
  const run=()=>{
    const old=st.mode;st.mode="RAD";
    try{
      const v=$("#syVar").value.trim().toLowerCase()||"x";
      if(!/^[a-z_]\w*$/.test(v))throw new CalcError("sintaxe","Nome de variável inválido",0);
      const src=$("#syIn").value,ord=parseInt($("#syOrd").value,10),at=$("#syAt").value.trim();
      let cur=SY.simp(SY.parse(src));
      const ds=[SY.print(cur)],lines=["f("+v+") = "+ds[0]];
      for(let k=1;k<=ord;k++){cur=SY.simp(SY.d(cur,v));ds.push(SY.print(cur));lines.push("f"+"′".repeat(k)+"("+v+") = "+ds[k])}
      if(at){
        const x0=evaluate(at),at0=x=>{const s=Object.create(null);s[v]=x;return s};
        lines.push("","em "+v+" = "+fmt(x0)+":");
        ds.forEach((e,k)=>lines.push("  f"+"′".repeat(k)+" = "+fmt(evaluate(e,at0(x0)))));
        const h=1e-6*Math.max(1,Math.abs(x0)),nd=(evaluate(src,at0(x0+h))-evaluate(src,at0(x0-h)))/(2*h);
        lines.push("  derivada numérica (conferência) = "+fmt(nd));
      }
      out.textContent=lines.join("\n");
    }catch(e){out.textContent=errText(e)}
    finally{st.mode=old}
  };
  ["#syIn","#syVar","#syAt"].forEach(s=>{$(s).oninput=run});
  $("#syOrd").onchange=run;
  run();
}
if(typeof document!=="undefined"&&document.getElementById("tl"))symbolicUI();
