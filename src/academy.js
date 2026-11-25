/* OVERKILL Academy — interface.
   Lê ACADEMY (academy-data.js) e ACADEMY_LESSONS (academy-lessons.js).
   Não depende do Oracle nem de rede. Não bloqueia aulas: quando faltam pré-requisitos, mostra um aviso com links. */
(function(){
if(typeof document==="undefined")return;

var ui={body:null,view:{type:"home"}};

function el(tag,cls,text){
  var e=document.createElement(tag);
  if(cls)e.className=cls;
  if(text!==undefined&&text!==null)e.textContent=text;
  return e;
}
function badge(text,cls){return el("span","acBadge"+(cls?" "+cls:""),text)}
function statusBadge(id){
  var s=academyStatus(id);
  return badge(s,s==="planejado"?"is-plan":"");
}
function go(view){
  ui.view=view;
  render();
  if(typeof window!=="undefined"&&window.scrollTo)window.scrollTo(0,0);
}
function linkButton(label,view,cls){
  var b=el("button",cls||"acLink",label);
  b.type="button";
  b.onclick=function(){go(view)};
  return b;
}
function lessonButton(id,extra){
  var t=academyTopic(id);
  var label=t?t.name:id;
  var b=linkButton(label,{type:"lesson",id:id});
  if(extra)b.append(" ",badge(extra,""));
  return b;
}
function li(node){var x=el("li");x.append(node);return x}
function nodeList(items){
  var ul=el("ul","acList");
  items.forEach(function(n){ul.append(li(n))});
  return ul;
}

// Blocos de aula (ver cabeçalho de academy-lessons.js).
function renderBlocks(blocks,box){
  (blocks||[]).forEach(function(b){
    if(typeof b==="string"){box.append(el("p","acP",b));return}
    if(b.ul){
      var ul=el("ul","acList");b.ul.forEach(function(t){ul.append(li(document.createTextNode(t)))});
      box.append(ul);return;
    }
    if(b.ol){
      var ol=el("ol","acList");b.ol.forEach(function(t){ol.append(li(document.createTextNode(t)))});
      box.append(ol);return;
    }
    if(b.math){box.append(el("div","math",b.math));return}
    if(b.glos){
      var dl=el("dl","acGlos");
      b.glos.forEach(function(pair){dl.append(el("dt","",pair[0]),el("dd","",pair[1]))});
      box.append(dl);return;
    }
    if(b.quiz){box.append(renderQuiz(b.quiz));return}
  });
  return box;
}

function renderQuiz(items){
  var box=el("div","quiz");
  items.forEach(function(it){
    var item=el("div","qItem");
    item.append(el("p","qQ",it.q));
    var opts=el("div","qOpts");
    var feed=el("p","acFeed");
    feed.setAttribute("aria-live","polite");
    var buttons=[];
    it.opcoes.forEach(function(texto,i){
      var b=el("button",null,texto);
      b.type="button";
      b.onclick=function(){
        if(feed.textContent)return;
        buttons.forEach(function(x,j){
          x.disabled=true;
          if(j===it.certa)x.classList.add("ac-ok");
        });
        if(i===it.certa){
          feed.classList.add("ac-ok");
          feed.textContent="Correta. "+it.explica;
        }else{
          b.classList.add("ac-no");
          feed.classList.add("ac-no");
          feed.textContent="Não é esta. "+it.explica;
        }
      };
      buttons.push(b);
      opts.append(b);
    });
    item.append(opts,feed);
    box.append(item);
  });
  return box;
}

function viewHome(){
  var root=el("div");
  root.append(el("h2","acTitle","OVERKILL Academy"));
  root.append(el("p","acP","Aulas de matemática em ordem de aprendizado. Você não precisa saber matemática antes: cada aula mostra o que deve ser visto antes dela."));
  root.append(el("p","acP acMuted","Tudo funciona sem internet e sem o Oracle."));

  var input=el("input","acSearch");
  input.type="search";
  input.id="acSearch";
  input.placeholder="Buscar assunto (ex.: logaritmo, frações)";
  input.setAttribute("aria-label","Buscar assunto na Academy");
  var results=el("div","acResults");
  results.hidden=true;
  var browse=el("div","acBrowse");

  input.oninput=function(){
    var q=input.value.trim();
    results.hidden=!q;
    browse.hidden=!!q;
    results.replaceChildren();
    if(!q)return;
    var found=academySearch(q);
    if(!found.length){results.append(el("p","acP acMuted","Nenhum assunto encontrado."));return}
    var ul=el("ul","acList");
    found.forEach(function(t){
      var a=academyArea(t.area);
      var b=linkButton(t.name,{type:"lesson",id:t.id});
      b.append(" ",badge(a?a.name:"",""));
      ul.append(li(b));
    });
    results.append(ul);
  };
  root.append(input,results);

  // Por onde começar: as primeiras aulas da trilha.
  var start=el("section","acStart");
  start.append(el("h3","acH","Por onde começar"));
  start.append(el("p","acP acMuted","Estas são as primeiras aulas da trilha. Siga a ordem: cada uma depende das anteriores."));
  var first=ACADEMY.topics.slice(0,4);
  start.append(nodeList(first.map(function(t){return lessonButton(t.id)})));
  browse.append(start);

  // Áreas, agrupadas por etapa.
  Object.keys(ACADEMY_ETAPAS).map(Number).sort(function(a,b){return a-b}).forEach(function(k){
    var areas=ACADEMY_AREAS.filter(function(a){return a.etapa===k}).sort(function(a,b){return a.n-b.n});
    if(!areas.length)return;
    var sec=el("section","acEtapa");
    sec.append(el("h3","acH",ACADEMY_ETAPAS[k]));
    var grid=el("div","cards");
    areas.forEach(function(a){
      var topics=academyTopicsOf(a.id);
      var written=topics.filter(function(t){return academyHasLesson(t.id)}).length;
      var card=el("button","card acArea");
      card.type="button";
      card.append(el("strong","",a.name),el("small","",a.desc));
      card.append(el("small","acMuted",a.nivel+" · "+topics.length+" aulas · "+written+" com texto"));
      card.onclick=function(){go({type:"area",id:a.id})};
      grid.append(card);
    });
    sec.append(grid);
    browse.append(sec);
  });
  root.append(browse);
  return root;
}

function viewArea(id){
  var a=academyArea(id);
  if(!a)return viewHome();
  var root=el("div");
  root.append(crumbs([{label:"Início",view:{type:"home"}},{label:a.name}]));
  root.append(el("h2","acTitle",a.name));
  root.append(el("p","acP",a.desc));
  root.append(el("p","acP acMuted","Nível: "+a.nivel+". Aulas em ordem de trilha:"));
  var ul=el("ul","acList acTrail");
  academyTopicsOf(a.id).forEach(function(t){
    var b=el("button","acRow");
    b.type="button";
    b.append(el("span","acOrder",String(t.order)),el("span","acRowName",t.name),el("small","acMuted",t.sub+" · "+t.level));
    b.append(statusBadge(t.id));
    b.onclick=function(){go({type:"lesson",id:t.id})};
    ul.append(li(b));
  });
  root.append(ul);
  return root;
}

function crumbs(items){
  var nav=el("nav","acCrumbs");
  nav.setAttribute("aria-label","Caminho");
  items.forEach(function(it,i){
    if(i)nav.append(el("span","acSep"," / "));
    if(it.view)nav.append(linkButton(it.label,it.view));
    else nav.append(el("span","",it.label));
  });
  return nav;
}

function viewLesson(id){
  var t=academyTopic(id);
  if(!t)return viewHome();
  var area=academyArea(t.area);
  var has=academyHasLesson(t.id);
  var root=el("article","acLesson");
  root.append(crumbs([
    {label:"Início",view:{type:"home"}},
    {label:area?area.name:"Área",view:area?{type:"area",id:area.id}:null},
    {label:t.name}
  ]));
  root.append(el("h2","acTitle",t.name));
  var meta=el("p","acMeta");
  meta.append(badge(t.level,""),statusBadge(t.id),badge(t.sub,""));
  root.append(meta);

  // Aviso de pré-requisitos sem texto (não bloqueia a aula).
  var missing=academyAncestors(t.id).filter(function(p){return !academyHasLesson(p.id)});
  if(missing.length){
    var warn=el("div","acWarn");
    warn.setAttribute("role","note");
    warn.append(el("strong","","Antes desta aula, veja estes pré-requisitos. Eles ainda não têm texto:"));
    var wl=el("ul","acList");
    missing.forEach(function(p){wl.append(li(lessonButton(p.id)))});
    warn.append(wl);
    warn.append(el("p","acP acMuted","Você pode ler a aula mesmo assim, mas algumas partes podem depender desses assuntos."));
    root.append(warn);
  }

  root.append(el("h3","acH","Objetivos"));
  root.append(nodeList(t.objectives.map(function(o){return document.createTextNode(o)})));

  var det=el("details");
  var sum=el("summary","",t.prereqs.length?"Pré-requisitos ("+t.prereqs.length+")":"Pré-requisitos (nenhum)");
  det.append(sum);
  if(t.prereqs.length){
    det.open=missing.length>0;
    det.append(nodeList(t.prereqs.map(function(p){return lessonButton(p)})));
  }else{
    det.append(el("p","acP acMuted","Nenhum. Pode começar por aqui."));
  }
  root.append(det);

  if(t.tools.length){
    root.append(el("h3","acH","Ferramentas relacionadas"));
    root.append(nodeList(t.tools.map(function(x){return document.createTextNode(x)})));
  }

  if(has){
    var lesson=ACADEMY_LESSONS[t.id];
    ACADEMY_SECTIONS.forEach(function(s){
      var key=s[0];
      root.append(el("h3","acH",s[1]));
      var box=el("div","acSec");
      var blocks=lesson.sections&&lesson.sections[key];
      if(blocks&&blocks.length)renderBlocks(blocks,box);
      else box.append(el("p","acP acMuted","Seção ainda não escrita."));
      root.append(box);
    });
  }else{
    var plan=el("section","acPlan");
    plan.append(el("h3","acH","Planejado"));
    plan.append(el("p","acP","Esta aula ainda não tem texto. Quando for escrita, terá estas 12 seções, nesta ordem:"));
    plan.append(nodeList(ACADEMY_SECTIONS.map(function(s){return document.createTextNode(s[1])})));
    root.append(plan);
  }

  var deps=t.dependents.map(function(d){return academyTopic(d)}).filter(Boolean);
  root.append(el("h3","acH","Aulas que dependem desta"));
  if(deps.length)root.append(nodeList(deps.map(function(d){return lessonButton(d.id)})));
  else root.append(el("p","acP acMuted","Nenhuma aula depende desta ainda."));

  var idx=ACADEMY.topics.indexOf(t);
  var prev=ACADEMY.topics[idx-1],next=ACADEMY.topics[idx+1];
  var nav=el("nav","acPager");
  if(prev)nav.append(linkButton("← "+prev.name,{type:"lesson",id:prev.id},"acLink acPrev"));
  if(next)nav.append(linkButton(next.name+" →",{type:"lesson",id:next.id},"acLink acNext"));
  root.append(nav);
  return root;
}

function render(){
  if(!ui.body)return;
  var v=ui.view,node;
  if(v.type==="area")node=viewArea(v.id);
  else if(v.type==="lesson")node=viewLesson(v.id);
  else node=viewHome();
  ui.body.replaceChildren(node);
}

function init(){
  ui.body=document.querySelector("#acBody");
  if(ui.body)render();
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);
else init();
})();
