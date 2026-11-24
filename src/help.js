// Renderiza o MANUAL.md dentro do app. Cobre o Markdown usado no manual:
// títulos, listas (com marcadores e numeradas), citações, negrito, código, links internos,
// tabelas em texto, blocos de código e linhas horizontais.

function manualSlug(text){
  return text.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu,"").trim().replace(/\s+/g,"-");
}

function renderManual(md,body){
  body.textContent="";
  const lines=md.split("\n");
  const ids=new Map();
  let list=null,cur=null,inCode=false;

  const inline=(el,raw)=>{
    const text=raw.replace(/ --- /g," — ");
    // links [texto](#ancora) viram navegação interna; links externos viram só o texto
    text.split(/(\[[^\]]+\]\([^)]+\)|`[^`]+`|\*\*[^*]+\*\*)/).forEach(p=>{
      if(!p)return;
      const link=p.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if(link){
        const a=document.createElement("a");
        a.textContent=link[1];
        if(link[2].startsWith("#")){
          a.href="#";
          a.onclick=e=>{
            e.preventDefault();
            const target=ids.get(link[2].slice(1));
            if(target)target.scrollIntoView({behavior:"smooth",block:"start"});
          };
        }
        el.append(a);
      }
      else if(p[0]==="`"&&p.length>1){const c=document.createElement("code");c.textContent=p.slice(1,-1);el.append(c)}
      else if(p.startsWith("**")&&p.length>3){const b=document.createElement("strong");b.textContent=p.slice(2,-2);el.append(b)}
      else el.append(document.createTextNode(p));
    });
  };
  // o texto de um parágrafo, item ou citação só é montado quando o bloco termina,
  // para que links e negritos que quebram linha no .md continuem válidos
  const flush=()=>{if(cur){inline(cur.el,cur.text);cur=null}};
  const reset=()=>{flush();list=null};
  const isSeparator=l=>/^\s*-{3,}(\s+-{3,})*\s*$/.test(l);

  for(let i=0;i<lines.length;i++){
    const line=lines[i];

    if(inCode){
      if(line.startsWith("```")){inCode=false;continue}
      body.lastChild.textContent+=(body.lastChild.textContent?"\n":"")+line;
      continue;
    }
    if(line.startsWith("```")){
      reset();const pre=document.createElement("pre");body.append(pre);inCode=true;continue;
    }
    // bloco LaTeX \[ ... \]: mostra o conteúdo como código, sem os delimitadores
    if(line.trim()==="\\["){
      reset();
      const pre=document.createElement("pre");
      const parts=[];
      i++;
      while(i<lines.length&&lines[i].trim()!=="\\]"){parts.push(lines[i]);i++}
      pre.textContent=parts.join("\n").trim();
      body.append(pre);continue;
    }
    // tabela em texto: linha de cabeçalho seguida de linha de traços
    if(line.trim()&&i+1<lines.length&&isSeparator(lines[i+1])&&!line.startsWith("#")){
      reset();
      const rows=[];
      while(i<lines.length&&lines[i].trim()){rows.push(lines[i]);i++}
      i--;
      const pre=document.createElement("pre");
      pre.className="tbl";
      pre.textContent=rows.filter(r=>!isSeparator(r)).join("\n");
      body.append(pre);continue;
    }
    if(isSeparator(line)||/^\s*(\*\*\*|___)\s*$/.test(line)){
      reset();body.append(document.createElement("hr"));continue;
    }

    const h=line.match(/^(#{1,3}) (.+)$/);
    if(h){
      reset();
      const level=h[1].length+1;
      const e=document.createElement("h"+level);
      const id=manualSlug(h[2].replace(/\*\*/g,"").replace(/ --- /g," — "));
      inline(e,h[2]);
      e.id=id;ids.set(id,e);
      body.append(e);continue;
    }

    // citação: linhas com ">" formam um único bloco
    const quote=line.match(/^>\s?(.*)$/);
    if(quote){
      if(!cur||cur.kind!=="q"){
        reset();
        const bq=document.createElement("blockquote");body.append(bq);
        cur={kind:"q",el:bq,text:""};
      }
      if(quote[1].trim())cur.text+=(cur.text?" ":"")+quote[1].trim();
      continue;
    }

    const num=line.match(/^(\d+)\.\s+(.*)$/);
    if(num){
      flush();
      if(!list||list.tagName!=="OL"){
        list=document.createElement("ol");
        if(Number(num[1])!==1)list.start=Number(num[1]);
        body.append(list);
      }
      const li=document.createElement("li");list.append(li);
      cur={kind:"li",el:li,text:num[2]};
      continue;
    }
    const bullet=line.match(/^\s*-\s+(.*)$/);
    if(bullet&&!/^\s{2,}/.test(line)){
      flush();
      if(!list||list.tagName!=="UL"){list=document.createElement("ul");body.append(list)}
      const li=document.createElement("li");list.append(li);
      cur={kind:"li",el:li,text:bullet[1]};
      continue;
    }
    // continuação de item de lista (linha indentada ou linha seguinte ao item)
    if(list&&cur&&cur.kind==="li"&&line.trim()){
      cur.text+=" "+line.trim();continue;
    }

    if(!line.trim()){reset();continue}
    if(!cur||cur.kind!=="p"){
      reset();
      const p=document.createElement("p");body.append(p);
      cur={kind:"p",el:p,text:""};
    }
    cur.text+=(cur.text?" ":"")+line.trim();
  }
  flush();
}
function helpUI(){
  const body=$("#hlpBody");
  fetch("MANUAL.md").then(r=>{if(!r.ok)throw new Error("http");return r.text()}).then(t=>renderManual(t,body)).catch(()=>{body.textContent="Não foi possível carregar o manual. Ele está no arquivo MANUAL.md do repositório."});
}
if(typeof document!=="undefined"&&document.getElementById("help"))helpUI();
