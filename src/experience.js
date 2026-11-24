/* Experiência: perfis de uso, tema, densidade, início adaptativo e troca de seções.
   Perfis só reorganizam a interface. Nenhum recurso é bloqueado por perfil. */
var XP=(function(){
const PREFS_KEY="overkill:prefs:v1";
const NS="http://www.w3.org/2000/svg";

// Módulos. "soon" = aparece na interface, mas ainda não tem função.
const MODULES={
  calc:{name:"Calculadora",icon:"i-calc",desc:"Expressões, histórico e variáveis",sec:"calcview"},
  mat:{name:"Matrizes",icon:"i-mat",desc:"Resolver Ax = b, determinante, inversa",sec:"mat"},
  gr:{name:"Gráfico",icon:"i-graph",desc:"Funções, polares e paramétricas",sec:"gr"},
  tl:{name:"Ferramentas",icon:"i-tools",desc:"Unidades, bits, IEEE 754, cores, estatística, álgebra",sec:"tl"},
  nb:{name:"Notebook",icon:"i-nb",desc:"Cálculos em células, salvos no navegador",sec:"nb"},
  oracle:{name:"Oracle",icon:"i-oracle",desc:"Planejado. Ainda não está disponível.",sec:null,soon:true}
};

// Perfis: ordem das abas, ferramenta inicial e ordem dos cartões no início.
const EXPERIENCES={
  learn:{name:"Aprender",icon:"i-compass",desc:"Gráficos, álgebra e matrizes com foco em entender cada passo.",tabs:["calc","gr","mat","tl","nb"],tool:"al",cards:["calc","gr","mat","tl","nb","oracle"]},
  work:{name:"Trabalhar",icon:"i-nb",desc:"Notebook, estatística e cálculos que você repete no dia a dia.",tabs:["nb","tl","mat","calc","gr"],tool:"st",cards:["nb","tl","calc","mat","gr","oracle"]},
  dev:{name:"Desenvolver",icon:"i-tools",desc:"Bits, ponto flutuante IEEE 754, bases numéricas e cores.",tabs:["tl","calc","mat","gr","nb"],tool:"bs",cards:["tl","calc","nb","mat","gr","oracle"]},
  explore:{name:"Explorar",icon:"i-graph",desc:"Visão geral de tudo. Sem ordem definida.",tabs:["gr","calc","tl","mat","nb"],tool:"sy",cards:["calc","gr","mat","tl","nb","oracle"]},
  daily:{name:"Uso cotidiano",icon:"i-calc",desc:"Calculadora simples, conversões de unidades e porcentagens.",tabs:["calc","tl","gr","mat","nb"],tool:"un",cards:["calc","tl","gr","mat","nb","oracle"]}
};
const THEMES={graphite:"Graphite",ember:"Ember",porcelain:"Porcelain",midnight:"Midnight"};
const DENSITIES={comfortable:"Confortável",compact:"Compacta"};
const DEFAULTS={exp:"explore",chosen:false,theme:"graphite",density:"comfortable",favs:["calc"],seen:false};

function normalizePrefs(p){
  const d=(p&&typeof p==="object")?p:{};
  const out={...DEFAULTS};
  if(Object.prototype.hasOwnProperty.call(EXPERIENCES,d.exp))out.exp=d.exp;
  out.chosen=d.chosen===true;
  if(Object.prototype.hasOwnProperty.call(THEMES,d.theme))out.theme=d.theme;
  if(Object.prototype.hasOwnProperty.call(DENSITIES,d.density))out.density=d.density;
  out.seen=d.seen===true;
  const favs=Array.isArray(d.favs)?d.favs:DEFAULTS.favs;
  out.favs=[...new Set(favs)].filter(k=>Object.prototype.hasOwnProperty.call(MODULES,k)&&!MODULES[k].soon).slice(0,8);
  return out;
}
function loadPrefs(){
  try{return normalizePrefs(JSON.parse(localStorage.getItem(PREFS_KEY)||"null"))}catch(e){return normalizePrefs(null)}
}
function savePrefs(p){
  try{localStorage.setItem(PREFS_KEY,JSON.stringify(p))}catch(e){}
}

function icon(id,cls){
  const s=document.createElementNS(NS,"svg");
  s.setAttribute("class",cls||"ic");s.setAttribute("aria-hidden","true");s.setAttribute("focusable","false");
  const u=document.createElementNS(NS,"use");u.setAttribute("href","#"+id);s.append(u);
  return s;
}
const $=s=>document.querySelector(s);

let prefs=normalizePrefs(null);

function applyPrefs(p){
  const root=document.documentElement;
  root.dataset.theme=p.theme;
  root.dataset.density=p.density;
  labelize();
  document.dispatchEvent(new Event("labels:change"));
  const meta=document.querySelector('meta[name="theme-color"]');
  if(meta){const c=getComputedStyle(root).getPropertyValue("--meta").trim();if(c)meta.setAttribute("content",c)}
  const exp=EXPERIENCES[p.exp];
  // Reordena a navegação: Início fixo à esquerda, módulos na ordem do perfil, Oracle por último.
  const nav=$(".tabs");
  if(nav){
    const order=["home",...exp.tabs,"oracle"];
    order.forEach(k=>{const b=nav.querySelector('button[data-tab="'+k+'"]');if(b)nav.append(b)});
  }
  $("#hello").textContent=exp.name;
  $("#expDesc").textContent=exp.desc;
}

function setTool(p){
  const sel=$("#tlSel");
  if(!sel)return;
  sel.value=EXPERIENCES[p.exp].tool;
  sel.dispatchEvent(new Event("change"));
}

function showTab(k){
  const map={home:"#home",calc:"#calcview",mat:"#mat",gr:"#gr",tl:"#tl",nb:"#nb",help:"#help",ajustes:"#ajustes"};
  if(!map[k])return;
  document.querySelectorAll("[data-tab]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.tab===k)));
  Object.keys(map).forEach(key=>{const el=$(map[key]);if(el)el.hidden=key!==k});
  if(k==="home")renderHome();
  if(k==="ajustes")renderSettings();
  if(typeof window!=="undefined"&&window.scrollTo)window.scrollTo(0,0);
}

function moduleCard(key){
  const m=MODULES[key];
  const card=document.createElement("div");
  card.className="card"+(m.soon?" soon":"");
  if(m.soon){
    const badge=document.createElement("span");badge.className="badge";badge.textContent="Em breve";
    const body=document.createElement("div");body.className="cardMain";
    body.append(icon(m.icon),Object.assign(document.createElement("strong"),{textContent:m.name}),Object.assign(document.createElement("small"),{textContent:m.desc}),badge);
    card.append(body);
    return card;
  }
  const main=document.createElement("button");main.type="button";main.className="cardMain";
  main.append(icon(m.icon),Object.assign(document.createElement("strong"),{textContent:m.name}),Object.assign(document.createElement("small"),{textContent:m.desc}));
  main.onclick=()=>showTab(key);
  const fav=prefs.favs.includes(key);
  const star=document.createElement("button");star.type="button";star.className="star";
  star.setAttribute("aria-pressed",String(fav));
  star.setAttribute("aria-label",(fav?"Remover ":"Fixar ")+m.name+(fav?" dos favoritos":" nos favoritos"));
  star.title=fav?"Remover dos favoritos":"Fixar nos favoritos";
  star.append(icon("i-star"));
  star.onclick=e=>{e.stopPropagation();toggleFav(key)};
  card.append(main,star);
  return card;
}

function toggleFav(key){
  prefs.favs=prefs.favs.includes(key)?prefs.favs.filter(k=>k!==key):[...prefs.favs,key].slice(0,8);
  savePrefs(prefs);
  renderHome();
}

function renderHome(){
  const exp=EXPERIENCES[prefs.exp];
  const favs=$("#favs"),cards=$("#cards");
  favs.textContent="";
  if(prefs.favs.length)prefs.favs.forEach(k=>favs.append(moduleCard(k)));
  else{const p=document.createElement("p");p.className="empty";p.style.gridColumn="1/-1";p.textContent="Marque módulos com a estrela para fixá-los aqui.";favs.append(p)}
  cards.textContent="";
  exp.cards.forEach(k=>cards.append(moduleCard(k)));
  renderRecent();
}

function renderRecent(){
  const ul=$("#recent"),empty=$("#recentEmpty");
  ul.textContent="";
  const list=(typeof st!=="undefined"&&Array.isArray(st.hist))?st.hist.slice(0,5):[];
  list.forEach(h=>{
    const li=document.createElement("li"),b=document.createElement("button");
    b.type="button";b.className="recent";
    const span=document.createElement("span");span.textContent=h.e;
    const r=document.createElement("b");r.textContent=" = "+h.r;
    b.append(icon("i-clock"),span,r);
    b.onclick=()=>{
      const ex=$("#expr");ex.value=h.e;ex.dispatchEvent(new Event("input"));
      showTab("calc");ex.focus({preventScroll:true});
    };
    li.append(b);ul.append(li);
  });
  empty.hidden=list.length>0;
}

function choiceButton(key,selected,onPick){
  const e=EXPERIENCES[key];
  const b=document.createElement("button");b.type="button";b.className="choice";
  b.setAttribute("aria-pressed",String(selected));
  const span=document.createElement("span");
  span.append(Object.assign(document.createElement("strong"),{textContent:e.name}),Object.assign(document.createElement("small"),{textContent:e.desc}));
  b.append(icon(e.icon),span);
  b.onclick=()=>onPick(key);
  return b;
}

function pickExperience(key){
  prefs.exp=key;prefs.chosen=true;prefs.seen=true;
  savePrefs(prefs);
  applyPrefs(prefs);setTool(prefs);renderHome();renderWelcome();renderSettings();
}

function renderWelcome(){
  const w=$("#welcome");
  if(!w)return;
  w.hidden=prefs.seen;
  const box=$("#choices");box.textContent="";
  Object.keys(EXPERIENCES).forEach(k=>box.append(choiceButton(k,prefs.chosen&&prefs.exp===k,pickExperience)));
}

function finishWelcome(){
  prefs.seen=true;
  savePrefs(prefs);
  renderWelcome();
}

function renderSettings(){
  const ex=$("#setExp");
  if(ex){ex.textContent="";Object.keys(EXPERIENCES).forEach(k=>ex.append(choiceButton(k,prefs.chosen&&prefs.exp===k,pickExperience)))}
  const seg=(id,map,cur,key)=>{
    const el=$(id);if(!el)return;el.textContent="";
    Object.keys(map).forEach(k=>{
      const b=document.createElement("button");b.type="button";b.textContent=map[k];
      b.setAttribute("aria-pressed",String(cur===k));
      b.onclick=()=>{prefs[key]=k;savePrefs(prefs);applyPrefs(prefs);renderSettings()};
      el.append(b);
    });
  };
  seg("#setTheme",THEMES,prefs.theme,"theme");
  seg("#setDensity",DENSITIES,prefs.density,"density");
}

function init(){
  prefs=loadPrefs();
  applyPrefs(prefs);
  renderWelcome();
  renderHome();
  $("#welcomeSkip").onclick=()=>{prefs.exp="explore";prefs.chosen=false;finishWelcome();applyPrefs(prefs);setTool(prefs);renderHome()};
  $("#welcomeAgain").onclick=()=>{prefs.seen=false;savePrefs(prefs);renderWelcome();showTab("home")};
  document.querySelectorAll("[data-tab]").forEach(b=>{
    if(b.disabled||b.dataset.tab==="oracle")return;
    b.addEventListener("click",()=>showTab(b.dataset.tab));
  });
  showTab("home");
}

if(typeof document!=="undefined"&&document.getElementById("home"))init();

return {MODULES,EXPERIENCES,THEMES,DENSITIES,DEFAULTS,normalizePrefs,loadPrefs,savePrefs,applyPrefs,showTab,PREFS_KEY};
})();
if(typeof module!=="undefined")module.exports=XP;
