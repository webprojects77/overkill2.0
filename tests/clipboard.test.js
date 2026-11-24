const {load,harness,dom}=require("./helpers");
const T=harness();
const run=async(stubs)=>{
  const d=dom(),w={isSecureContext:stubs.secure!==false};
  const {get}=load(["src/core.js"],{document:{...d.document,execCommand:()=>stubs.exec??false},window:w,navigator:stubs.clip===undefined?{}:{clipboard:{writeText:async v=>{if(stubs.clip==="fail")throw new Error("x");stubs.got=v}}}});
  return get("copyText")("abc");
};
(async()=>{
  const a={clip:"ok"};T.eq("clipboard API",await run(a),true);T.eq("valor copiado",a.got,"abc");
  T.eq("sem API, execCommand ok",await run({exec:true}),true);
  T.eq("API falha, execCommand ok",await run({clip:"fail",exec:true}),true);
  T.eq("contexto inseguro usa execCommand",await run({clip:"ok",secure:false,exec:true}),true);
  T.eq("tudo falha",await run({exec:false}),false);
  T.done("clipboard");
})();
