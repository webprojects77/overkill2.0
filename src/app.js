const KEY="overkill:v1";
function load(){try{const d=JSON.parse(localStorage.getItem(KEY)||"{}");if(d.mode==="DEG"||d.mode==="RAD")st.mode=d.mode;if([8,12,15].includes(d.prec))st.prec=d.prec;if(Array.isArray(d.hist))st.hist=d.hist.slice(0,100);if(typeof d.ans==="number")st.ans=d.ans;loadExtra(d)}catch(e){}}
function loadExtra(d){
  if(["R","C","Q","D"].includes(d.num))st.num=d.num;
  if(DD_OPTS.includes(d.dd))st.dd=d.dd;
  if(typeof d.dans==="string"&&d.dans.length<5000&&/^-?\d+e-?\d+$/.test(d.dans))st.dans=d.dans;
  const ok=n=>/^[A-Za-z_]\w*$/.test(n);
  if(d.vars&&typeof d.vars==="object")for(const k of Object.keys(d.vars))if(ok(k)&&Number.isFinite(d.vars[k]))st.vars[k]=d.vars[k];
  if(d.fns&&typeof d.fns==="object")for(const k of Object.keys(d.fns)){const f=d.fns[k];if(ok(k)&&f&&Array.isArray(f.p)&&f.p.length&&f.p.every(x=>typeof x==="string"&&ok(x))&&typeof f.b==="string")st.fns[k]={p:f.p,b:f.b}}
}
function save(){try{localStorage.setItem(KEY,JSON.stringify(st,(k,v)=>k==="info"?undefined:v))}catch(e){console.warn("OVERKILL: não foi possível salvar no armazenamento local",e)}}

function renderVars(){
  const ul=$("#vars");ul.textContent="";
  const add=(label,del)=>{
    const li=document.createElement("li"),s=document.createElement("span"),b=document.createElement("button");
    s.textContent=label;b.type="button";b.textContent="×";b.setAttribute("aria-label","Remover "+label);
    b.onclick=()=>{del();save();renderVars()};li.append(s,b);ul.append(li);
  };
  for(const k of Object.keys(st.vars))add(k+" = "+fmt(st.vars[k]),()=>{delete st.vars[k]});
  for(const k of Object.keys(st.fns))add(k+"("+st.fns[k].p.join(", ")+") = "+st.fns[k].b,()=>{delete st.fns[k]});
}
const ex=$("#expr"),prev=$("#prev"),res=$("#res"),err=$("#err");
let lastText="";

function showErr(e){
  if(e instanceof CalcError)err.textContent="Erro de "+e.kind+" (posição "+((e.pos||0)+1)+"): "+e.message;
  else err.textContent=errText(e);
}
function live(){
  err.textContent="";
  const s=ex.value;
  if(!s.trim()){res.textContent=lastText;return}
  try{st.info="";const o=evalAny(s);res.textContent="= "+o.r;res.dataset.v=o.r;$("#info").textContent=st.info}catch(e){res.textContent="";$("#info").textContent=""}
}
function commit(){
  let s=ex.value;
  if(!s.trim())return;
  if(/^\s*[*\/^×÷]/.test(s))s="ans"+s;
  try{
    const o=execute(s);
    if(o.v!==undefined)st.ans=o.v;
    const r=o.r;
    st.hist.unshift({e:s,r});st.hist=st.hist.slice(0,100);
    prev.textContent=s;lastText=r;res.textContent=r;res.dataset.v=r;ex.value="";err.textContent="";$("#info").textContent=st.info;
    save();renderHist();renderVars();
  }catch(e){showErr(e)}
}
function insert(txt){
  const a=ex.selectionStart??ex.value.length,b=ex.selectionEnd??a;
  ex.value=ex.value.slice(0,a)+txt+ex.value.slice(b);
  const c=a+txt.length;ex.focus({preventScroll:true});ex.setSelectionRange(c,c);live();
}
function back(){
  const a=ex.selectionStart??ex.value.length,b=ex.selectionEnd??a;
  if(a!==b){ex.value=ex.value.slice(0,a)+ex.value.slice(b);ex.setSelectionRange(a,a)}
  else if(a>0){ex.value=ex.value.slice(0,a-1)+ex.value.slice(a);ex.setSelectionRange(a-1,a-1)}
  live();
}
function renderHist(){
  const ul=$("#hist");ul.textContent="";
  st.hist.forEach(h=>{
    const li=document.createElement("li"),b=document.createElement("button"),r=document.createElement("b");
    b.type="button";r.textContent=" = "+h.r;b.append(document.createTextNode(h.e),r);
    b.onclick=()=>{ex.value=h.e;ex.focus({preventScroll:true});live()};
    li.append(b);ul.append(li);
  });
}

const KEYS=[
["C","clr","op"],["⌫","bs","op"],["(","(","op"],[")",")","op"],
["sin","sin(","op"],["cos","cos(","op"],["tan","tan(","op"],["^","^","op"],
["ln","ln(","op"],["log","log(","op"],["√","sqrt(","op"],["!","!","op"],
["7","7"],["8","8"],["9","9"],["÷","/","op"],
["4","4"],["5","5"],["6","6"],["×","*","op"],
["1","1"],["2","2"],["3","3"],["−","-","op"],
["0","0"],[".","."],["π","pi","op"],["+","+","op"],
["ans","ans","op"],["%","%","op"],["e","e","op"],[",",",","op"],
["i","i","op"],["gcd","gcd(","op"],["abs","abs(","op"],["conj","conj(","op"],
["=","eq","eq"]
];
const pad=$("#pad");
KEYS.forEach(([l,v,c])=>{
  const b=document.createElement("button");b.type="button";b.textContent=l;if(c)b.className=c;
  b.setAttribute("aria-label",({bs:"Apagar",clr:"Limpar",eq:"Calcular"})[v]||l);
  b.onclick=()=>{
    if(v==="clr"){ex.value="";prev.textContent="";lastText="";res.textContent="";err.textContent="";ex.focus({preventScroll:true})}
    else if(v==="bs")back();
    else if(v==="eq")commit();
    else insert(v);
  };
  pad.append(b);
});

ex.addEventListener("input",live);
ex.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();commit()}else if(e.key==="Escape"){ex.value="";live()}});
async function copy(){
  const v=res.dataset.v;if(!v)return;
  const o=res.textContent,ok=await copyText(v);
  res.textContent=ok?"copiado":"não foi possível copiar";
  setTimeout(()=>{res.textContent=o},900);
}
res.onclick=copy;
res.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();copy()}};
$("#mode").onclick=()=>{st.mode=st.mode==="DEG"?"RAD":"DEG";syncMode();save();live()};
$("#numMode").onclick=()=>{st.num={R:"C",C:"Q",Q:"D",D:"R"}[st.num];syncNum();save();live()};
$("#dprec").onchange=e=>{st.dd=parseInt(e.target.value,10);save();live()};
$("#prec").onchange=e=>{st.prec=parseInt(e.target.value,10);save();live()};
$("#clr").onclick=()=>{if(st.hist.length&&confirm("Apagar todo o histórico?")){st.hist=[];save();renderHist()}};

const NUMLBL={R:["ℝ","Reais"],C:["ℂ","Complexos"],Q:["ℚ","Racionais"],D:["Dec","Decimal"]};
function syncNum(){const [s,f]=NUMLBL[st.num];$("#numMode").textContent=lbl(s,f);$("#dprec").hidden=st.num!=="D";$("#prec").hidden=st.num==="D"}
function syncMode(){$("#mode").textContent=st.mode==="DEG"?lbl("DEG","Graus"):lbl("RAD","Radianos")}
document.addEventListener("labels:change",()=>{syncNum();syncMode()});

load();
syncNum();$("#dprec").value=String(st.dd);
syncMode();$("#prec").value=String(st.prec);renderHist();renderVars();
if(matchMedia("(pointer:fine)").matches)ex.focus();else ex.setAttribute("inputmode","none");
