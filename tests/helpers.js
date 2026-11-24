const vm=require("vm"),fs=require("fs"),path=require("path");
const root=path.join(__dirname,"..");
function load(files,stubs={}){
  const ctx=vm.createContext({console,setTimeout,clearTimeout,...stubs});
  for(const f of files)vm.runInContext(fs.readFileSync(path.join(root,f),"utf8"),ctx,{filename:f});
  return {ctx,get:n=>vm.runInContext(n,ctx)};
}
function harness(){
  let bad=0,n=0;
  const fail=(...a)=>{bad++;console.log("FALHOU",...a)};
  return {
    ok:(name,c,extra)=>{n++;if(!c)fail(name,extra===undefined?"":JSON.stringify(extra))},
    eq:(name,got,want)=>{n++;if(got!==want)fail(name,"->",JSON.stringify(got),"esperava",JSON.stringify(want))},
    near:(name,got,want,tol=1e-9)=>{n++;if(typeof got!=="number"||!(Math.abs(got-want)<=tol*Math.max(1,Math.abs(want))))fail(name,"->",got,"esperava",want)},
    throws:(name,f,Err)=>{n++;try{f();fail("SEM ERRO",name)}catch(e){if(Err&&!(e instanceof Err))fail("ERRO DE TIPO INESPERADO",name,e&&e.message)}},
    done:label=>{console.log(bad?label+": FALHAS "+bad+" de "+n:label+": ok ("+n+" verificações)");process.exit(bad?1:0)}
  };
}
function dom(){
  const created=[];
  const mk=tag=>{
    const e={tag,kids:[],className:"",value:"",_t:"",attrs:{},style:{},clicks:0,
      get textContent(){return this._t},set textContent(v){this._t=v;if(v==="")this.kids=[]},
      append(...c){this.kids.push(...c)},appendChild(c){this.kids.push(c);return c},
      setAttribute(k,v){this.attrs[k]=v},click(){this.clicks++},remove(){},select(){}};
    created.push(e);return e;
  };
  const els={};const q=s=>els[s]||(els[s]=mk(s));
  const document={querySelector:q,getElementById:q,createElement:mk,createTextNode:t=>({text:t}),body:mk("body"),execCommand:()=>false};
  return {document,els,q,mk,created};
}
module.exports={load,harness,dom,root};
