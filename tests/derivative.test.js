const {load,harness}=require("./helpers");
const {get}=load(["src/core.js","src/algebra.js","src/symbolic.js"]);
const T=harness(),SY=get("SY"),st=get("st"),evaluate=get("evaluate"),CalcError=get("CalcError");
st.mode="RAD";
const D=(s,o=1)=>{let c=SY.simp(SY.parse(s));for(let k=0;k<o;k++)c=SY.simp(SY.d(c,"x"));return SY.print(c)};
[["x^2","2x"],["sin(x)","cos(x)"],["x^3+2x","3x^2 + 2"],["ln(x)","1/x"],["5","0"],["a*x","a"],["cos(x)","-sin(x)"],["x","1"],["3x","3"],["exp(x)","exp(x)"],["sqrt(x)","1/(2sqrt(x))"],["a(x+1)","a"],["pi*x","pi"]].forEach(([e,w])=>T.eq("d "+e,D(e),w));
T.eq("d² x^4",D("x^4",2),"12x^2");
const exprs=["x^2","sin(x)","x^3+2x","sin(x^2)","ln(x)","x*exp(x)","x^x","1/x","sqrt(x)","cos(x)*sin(x)","tan(x)","atan(x)","(x^2+1)/(x-3)","2^x","exp(2x)","asin(x/2)","sinh(x)*cosh(x)","tanh(x)","log(x)","x^(1/3)","abs(x)","-x^2","sqrt(1-x^2)","x^2*ln(x)","log2(x)","acos(x/2)","cbrt(x)","x^2*sin(x)","sin(cos(x))","exp(-x^2)","(x+1)^3","3-x","x/(1+x^2)","2*x*3","5*(x+1)","-(x-2)"];
for(const e of exprs)for(const o of [1,2]){
  try{
    const d=D(e,o),sc=x=>{const s=Object.create(null);s.x=x;return s};
    const f=x=>evaluate(e,sc(x)),x0=0.7,h=1e-4;
    const num=o===1?(f(x0+h)-f(x0-h))/(2*h):(f(x0+h)-2*f(x0)+f(x0-h))/(h*h);
    const sym=evaluate(d,sc(x0));
    T.ok("numérico "+e+" ordem "+o,Math.abs(sym-num)<=1e-3*Math.max(1,Math.abs(sym)),{sym,num,d});
  }catch(x){T.ok("sem exceção "+e+" ordem "+o,false,x.message)}
}
["foo(x)","gamma(x)","sec(x)","x+","(x","x!"].forEach(e=>T.throws("erro "+e,()=>D(e),CalcError));
T.done("derivadas");
