const {load,harness,dom}=require("./helpers");
const T=harness();
function boot(opt={}){
  const d=dom(),calls={stroke:0,text:0,arc:0,line:0,move:0};
  const ctx=new Proxy({},{get:(t,k)=>k==="stroke"?()=>calls.stroke++:k==="arc"?()=>calls.arc++:k==="fillText"?()=>calls.text++:k==="lineTo"?()=>calls.line++:k==="moveTo"?()=>calls.move++:()=>{},set:()=>true});
  const cv=d.q("#grCv");Object.assign(cv,{getContext:()=>ctx,clientWidth:360,clientHeight:320,addEventListener(){},setPointerCapture(){},getBoundingClientRect:()=>({left:0,top:0}),toDataURL:()=>"data:image/png;base64,AA",toBlob:opt.noBlob?undefined:f=>f(opt.nullBlob?null:{})});
  class RO{constructor(cb){RO.cb=cb}observe(){}}
  d.q("#grIn").value="sin(x)\nx^2/4-1\ntan(x)\nsqrt(x)";d.q("#grMode").value="cart";d.q("#grT0").value="0";d.q("#grT1").value="4pi";
  const g=load(["src/core.js","src/algebra.js","src/graph.js"],{document:d.document,ResizeObserver:RO,window:{devicePixelRatio:1},URL:{createObjectURL:()=>"blob:x",revokeObjectURL(){}}});
  RO.cb();
  return {d,calls,RO,get:g.get};
}
let {d,calls}=boot();
T.ok("traçou curvas e grade",calls.stroke>=6,calls);T.ok("rótulos",calls.text>5);
d.q("#grCv").onpointermove({clientX:200,clientY:100,pointerId:1});T.ok("rastreador",/x = .* y = /.test(d.q("#grInfo").textContent),d.q("#grInfo").textContent);
d.q("#grIn").value="sin(x)";d.q("#grRt").onclick();T.ok("raízes",/Raízes/.test(d.q("#grInfo").textContent)&&!/undefined|NaN/.test(d.q("#grInfo").textContent),d.q("#grInfo").textContent);
const s0=calls.stroke;d.q("#grZi").onclick();T.ok("zoom redesenha",calls.stroke>s0);
d.q("#grCv").onpointerdown({clientX:100,clientY:100,pointerId:1});d.q("#grCv").onpointermove({clientX:140,clientY:120,pointerId:1});d.q("#grCv").onpointerup({clientX:140,clientY:120});
d.q("#grMode").value="polar";d.q("#grMode").onchange();T.ok("polar",d.q("#grIn").value.includes("cos(t)"));
d.q("#grMode").value="par";d.q("#grMode").onchange();T.eq("paramétrico sem erro",d.q("#grInfo").textContent,"");
calls.line=0;calls.move=0;d.q("#grIn").value="cos(t);sin(t)";d.q("#grPlot").onclick();T.ok("amostragem paramétrica proporcional ao intervalo",calls.line+calls.move>=3000,calls.line+calls.move);
calls.line=0;calls.move=0;d.q("#grT1").value="40pi";d.q("#grPlot").onclick();T.ok("intervalo maior, mais amostras",calls.line+calls.move>=30000,calls.line+calls.move);
d.q("#grIn").value="sin(";d.q("#grPlot").onclick();T.ok("erro de sintaxe aparece",/Linha 1/.test(d.q("#grInfo").textContent));
d.q("#grMode").value="cart";d.q("#grIn").value="1/x\ntan(x)";d.q("#grPlot").onclick();T.eq("assíntotas sem erro",d.q("#grInfo").textContent,"");
({d,calls}=boot({noBlob:true}));d.created.length=0;d.q("#grPng").onclick();
const a=d.created.find(e=>e.tag==="a");T.ok("PNG sem toBlob usa toDataURL",a&&a.clicks===1&&a.download==="overkill-grafico.png"&&String(a.href).startsWith("data:image/png"),a&&a.href);
({d}=boot({nullBlob:true}));d.q("#grPng").onclick();T.eq("PNG nulo avisa",d.q("#grInfo").textContent,"Não foi possível gerar o PNG");
T.done("gráfico");
