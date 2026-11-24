const NB={
  STORE:"overkill:nb:v1",
  blank:name=>({name:name||"Novo notebook",num:"R",dd:50,mode:"DEG",cells:[{k:"calc",s:""}]}),
  example:()=>({name:"Meu primeiro notebook",num:"R",dd:50,mode:"DEG",cells:[
    {k:"note",s:"Juros compostos: quanto rendem R$ 1000 a 5% ao ano?"},
    {k:"calc",s:"capital=1000\ntaxa=0.05\nf(n)=capital*(1+taxa)^n\nf(10)"},
    {k:"note",s:"Em quantos anos o dinheiro dobra? Resolva f(n)=2000."},
    {k:"calc",s:"g(n)=f(n)-2*capital\nsolve(g,10)"}
  ]}),
  proj(x){
    if(!x||typeof x!=="object")return null;
    const cells=(Array.isArray(x.cells)?x.cells:[]).slice(0,200).filter(c=>c&&(c.k==="calc"||c.k==="note")&&typeof c.s==="string").map(c=>({k:c.k,s:c.s.slice(0,20000)}));
    return {
      name:(typeof x.name==="string"&&x.name.trim()?x.name.trim():"Notebook").slice(0,80),
      num:["R","C","Q","D"].includes(x.num)?x.num:"R",
      dd:DD_OPTS.includes(x.dd)?x.dd:50,
      mode:x.mode==="RAD"?"RAD":"DEG",
      cells:cells.length?cells:[{k:"calc",s:""}]
    };
  },
  all(d){
    const S={cur:"",projects:Object.create(null)};
    if(d&&typeof d==="object"&&d.projects&&typeof d.projects==="object")
      for(const id of Object.keys(d.projects).slice(0,50)){const p=NB.proj(d.projects[id]);if(p&&/^[a-z0-9_-]{1,40}$/.test(id))S.projects[id]=p}
    if(!Object.keys(S.projects).length)S.projects.p1=NB.example();
    S.cur=d&&typeof d.cur==="string"&&Object.hasOwn(S.projects,d.cur)?d.cur:Object.keys(S.projects)[0];
    return S;
  },
  parseImport(text){
    if(text.length>2e6)throw new Error("Arquivo grande demais");
    let d;try{d=JSON.parse(text)}catch(e){throw new Error("O arquivo não é um JSON válido")}
    if(!d||d.format!=="overkill-notebook"||!d.project)throw new Error("O arquivo não é um notebook do OVERKILL");
    if(typeof d.version==="number"&&d.version>1)throw new Error("O arquivo é de uma versão mais nova que a suportada");
    const p=NB.proj(d.project);
    if(!p)throw new Error("Notebook inválido");
    return p;
  },
  exportJson:p=>JSON.stringify({format:"overkill-notebook",version:1,project:p},null,2),
  cell(src){
    return src.split("\n").map(line=>{
      const t=line.trim();
      if(!t||t.startsWith("#"))return null;
      try{const o=execute(t);if(o.v!==undefined)st.ans=o.v;return {e:t,r:o.r,i:st.info}}
      catch(e){return {e:t,err:e instanceof CalcError?"erro de "+e.kind+" (posição "+((e.pos||0)+1)+"): "+e.message:errText(e)}}
    }).filter(Boolean);
  },
  run(p){
    const keep={vars:st.vars,fns:st.fns,ans:st.ans,dans:st.dans,num:st.num,dd:st.dd,mode:st.mode,info:st.info};
    st.vars=Object.create(null);st.fns=Object.create(null);st.ans=0;st.dans="";st.num=p.num;st.dd=p.dd;st.mode=p.mode;
    try{return p.cells.map(c=>c.k==="calc"?NB.cell(c.s):null)}
    finally{Object.assign(st,keep)}
  },
  markdown(p){
    const res=NB.run(p),out=["# "+p.name,"","Conjunto numérico: "+(p.num==="D"?"Dec ("+p.dd+" dígitos)":p.num)+" · ângulos: "+p.mode,""];
    p.cells.forEach((c,i)=>{
      if(c.k==="note"){out.push(c.s,"");return}
      out.push("```",c.s,"```");
      (res[i]||[]).forEach(l=>out.push("- `"+l.e.replace(/`/g,"'")+"` → "+(l.err?l.err:"`"+l.r+"`")));
      out.push("");
    });
    return out.join("\n");
  }
};
function notebookUI(){
  let S,outs=[],tm=0;
  try{S=NB.all(JSON.parse(localStorage.getItem(NB.STORE)||"null"))}catch(e){S=NB.all(null)}
  const P=()=>S.projects[S.cur];
  const persist=()=>{try{localStorage.setItem(NB.STORE,JSON.stringify(S))}catch(e){msg("Não foi possível salvar: armazenamento cheio ou bloqueado")}};
  const el=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!==undefined)e.textContent=x;return e};
  const msg=t=>{$("#nbMsg").textContent=t};
  const uid=()=>"p"+Date.now().toString(36)+Math.floor(Math.random()*1296).toString(36);
  const dl=(name,text,type)=>{const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([text],{type}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)};
  const slug=()=>P().name.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"notebook";
  const later=()=>{clearTimeout(tm);tm=setTimeout(runAll,350)};
  function runAll(){
    const res=NB.run(P());
    res.forEach((r,i)=>{
      const o=outs[i];if(!o)return;
      o.textContent="";
      (r||[]).forEach(l=>{
        const d=el("div",l.err?"nbErr":"nbOk");
        d.append(el("span","nbE",l.e),document.createTextNode(l.err?"  ✗ "+l.err:"  →  "+l.r));
        if(l.i)d.append(el("div","nbI",l.i));
        o.append(d);
      });
    });
  }
  function move(i,d){const c=P().cells,j=i+d;if(j<0||j>=c.length)return;[c[i],c[j]]=[c[j],c[i]];persist();render()}
  function del(i){const c=P().cells;c.splice(i,1);if(!c.length)c.push({k:"calc",s:""});persist();render()}
  function add(k){if(P().cells.length>=200){msg("Limite de 200 células");return}P().cells.push({k,s:""});persist();render()}
  function fillSel(){
    const s=$("#nbSel");s.textContent="";
    Object.keys(S.projects).forEach(id=>{const o=document.createElement("option");o.value=id;o.textContent=S.projects[id].name;s.append(o)});
    s.value=S.cur;$("#nbNum").value=P().num;$("#nbDd").value=String(P().dd);$("#nbDd").hidden=P().num!=="D";$("#nbMode").value=P().mode;
  }
  function render(){
    const box=$("#nbCells");box.textContent="";outs=[];
    P().cells.forEach((c,i)=>{
      const w=el("div","cell"),h=el("div","cellH",c.k==="calc"?"cálculo":"nota");
      const b=(t,f,l)=>{const x=el("button","",t);x.type="button";x.setAttribute("aria-label",l);x.onclick=f;return x};
      h.append(b("↑",()=>move(i,-1),"Subir célula"),b("↓",()=>move(i,1),"Descer célula"),b("×",()=>del(i),"Remover célula"));
      const ta=el("textarea");ta.value=c.s;ta.spellcheck=false;
      const rows=()=>{ta.rows=Math.max(2,Math.min(8,ta.value.split("\n").length))};rows();
      ta.setAttribute("aria-label",c.k==="calc"?"Célula de cálculo":"Célula de nota");
      ta.oninput=()=>{c.s=ta.value.slice(0,20000);rows();persist();later()};
      w.append(h,ta);
      if(c.k==="calc"){const o=el("div","nbOut");outs[i]=o;w.append(o)}
      box.append(w);
    });
    runAll();
  }
  $("#nbSel").onchange=()=>{S.cur=$("#nbSel").value;persist();fillSel();render();msg("")};
  $("#nbNew").onclick=()=>{if(Object.keys(S.projects).length>=50){msg("Limite de 50 notebooks");return}const id=uid();S.projects[id]=NB.blank("Notebook "+(Object.keys(S.projects).length+1));S.cur=id;persist();fillSel();render();msg("")};
  $("#nbRen").onclick=()=>{const n=prompt("Nome do notebook",P().name);if(n&&n.trim()){P().name=n.trim().slice(0,80);persist();fillSel()}};
  $("#nbDel").onclick=()=>{
    if(!confirm("Excluir o notebook “"+P().name+"”?"))return;
    delete S.projects[S.cur];
    if(!Object.keys(S.projects).length)S.projects.p1=NB.blank("Notebook 1");
    S.cur=Object.keys(S.projects)[0];persist();fillSel();render();
  };
  $("#nbNum").onchange=()=>{P().num=$("#nbNum").value;$("#nbDd").hidden=P().num!=="D";persist();runAll()};
  $("#nbDd").onchange=()=>{P().dd=parseInt($("#nbDd").value,10);persist();runAll()};
  $("#nbMode").onchange=()=>{P().mode=$("#nbMode").value;persist();runAll()};
  $("#nbAddC").onclick=()=>add("calc");
  $("#nbAddN").onclick=()=>add("note");
  $("#nbExp").onclick=()=>{dl(slug()+".overkill.json",NB.exportJson(P()),"application/json");msg("Arquivo .json gerado")};
  $("#nbMd").onclick=()=>{dl(slug()+".md",NB.markdown(P()),"text/markdown");msg("Relatório .md gerado")};
  $("#nbImp").onclick=()=>$("#nbFile").click();
  $("#nbFile").onchange=e=>{
    const f=e.target.files&&e.target.files[0];if(!f)return;
    if(f.size>2e6){msg("Arquivo grande demais (máximo 2 MB)");e.target.value="";return}
    const r=new FileReader();
    r.onload=()=>{
      try{if(Object.keys(S.projects).length>=50)throw new Error("limite de 50 notebooks atingido");const p=NB.parseImport(String(r.result)),id=uid();S.projects[id]=p;S.cur=id;persist();fillSel();render();msg("Importado: "+p.name)}
      catch(x){msg("Não foi possível importar: "+x.message)}
      e.target.value="";
    };
    r.onerror=()=>msg("Não foi possível ler o arquivo");
    r.readAsText(f);
  };
  fillSel();render();persist();
}
if(typeof document!=="undefined"&&document.getElementById("nb"))notebookUI();
