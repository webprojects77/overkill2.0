const {load,harness}=require("./helpers");
const T=harness();
const {ctx,get}=load(["src/academy-data.js","src/academy-lessons.js"]);
const A=get("ACADEMY"),LES=get("ACADEMY_LESSONS"),SEC=get("ACADEMY_SECTIONS"),AREAS=get("ACADEMY_AREAS");
const search=q=>get("academySearch")(q);

T.eq("grafo sem erros",A.errors.join(" | "),"");
T.ok("há assuntos",A.topics.length>100,A.topics.length);
const ids=new Set(A.topics.map(t=>t.id));
T.eq("ids únicos",ids.size,A.topics.length);
AREAS.forEach(a=>T.ok("área "+a.id+" tem assuntos",A.topics.some(t=>t.area===a.id),a.id));
T.eq("12 seções obrigatórias",SEC.length,12);
T.ok("seções em ordem",SEC.map(s=>s[0]).join()==="oque,paraque,porque,comofunciona,comocalcular,formulas,exemplos,pratica,erros,relacoes,exercicios,glossario");

// Ordem da trilha: todo pré-requisito vem antes do assunto.
A.topics.forEach(t=>t.prereqs.forEach(p=>T.ok("trilha: "+p+" antes de "+t.id,A.byId[p].order<t.order,[p,t.id])));
// Níveis válidos.
A.topics.forEach(t=>T.ok("nível válido "+t.id,["Iniciante","Básico","Intermediário","Avançado"].includes(t.level),t.level));

Object.keys(LES).forEach(id=>{
  T.ok("aula "+id+" existe na grade",ids.has(id),id);
  const l=LES[id];
  SEC.forEach(([k,title])=>{
    const b=l.sections[k];
    T.ok("aula "+id+" tem seção "+title,Array.isArray(b)&&b.length>0,k);
  });
  // Quizzes com índices válidos.
  SEC.forEach(([k])=>{(l.sections[k]||[]).forEach(b=>{
    if(b.quiz)b.quiz.forEach(it=>{
      T.ok("quiz "+id+": certa dentro do intervalo",Number.isInteger(it.certa)&&it.certa>=0&&it.certa<it.opcoes.length,it.q);
      T.ok("quiz "+id+": tem explicação",typeof it.explica==="string"&&it.explica.length>0,it.q);
    });
  })});
  // Pré-requisitos de cada aula existem (direto na grade).
  A.byId[id].prereqs.forEach(p=>T.ok("pré-requisito "+p+" de "+id+" existe",!!A.byId[p]));
});

// Pilotos: pré-requisitos de logaritmos sem texto devem ser detectados.
const missing=get("academyAncestors")("logaritmos").filter(p=>!get("academyHasLesson")(p.id)).map(p=>p.id);
T.ok("logaritmos: multiplicacao e divisao sem texto",missing.includes("multiplicacao")&&missing.includes("divisao"),missing);
T.ok("potenciacao tem texto",get("academyHasLesson")("potenciacao"));
T.eq("status de aula sem texto",get("academyStatus")("radiciacao"),"planejado");

// Busca sem acento e por palavra parcial.
T.ok("busca sem acento",search("logaritmo").some(t=>t.id==="logaritmos"));
T.ok("busca com acento",search("potenciação").some(t=>t.id==="potenciacao"));
T.ok("busca vazia",search("   ").length===0);
T.ok("busca não acha inexistente",search("zzqxw").length===0);

// Ferramentas ligadas a assuntos existentes.
Object.keys(get("ACADEMY_TOOLS")).forEach(id=>T.ok("ferramenta ligada a assunto existente "+id,ids.has(id),id));

T.done("academia");
