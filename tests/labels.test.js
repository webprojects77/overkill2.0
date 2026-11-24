const {load,harness}=require("./helpers");
const T=harness();
const {ctx,get}=load(["src/labels.js"]);
// sem DOM: volta para a forma completa
T.eq("sem DOM usa palavra inteira",get("lbl('Dec','Decimal')"),"Decimal");
// com densidade confortável
ctx.document={documentElement:{dataset:{density:"comfortable"}}};
T.eq("confortável mostra palavra inteira",get("lbl('Dec','Decimal')"),"Decimal");
// troca para compacta sem recarregar
ctx.document.documentElement.dataset.density="compact";
T.eq("compacta mostra abreviação",get("lbl('Dec','Decimal')"),"Dec");
T.eq("compacta mostra DEG",get("lbl('DEG','Graus')"),"DEG");
// labelize troca textos de elementos com data-full/data-short
const els=[
  {dataset:{full:"Redefinir",short:"Reset"},textContent:"Redefinir"},
  {dataset:{full:"Graus",short:"DEG"},textContent:"Graus"}
];
ctx.document.querySelectorAll=()=>els;
get("labelize()");
T.eq("labelize compacta 1",els[0].textContent,"Reset");
T.eq("labelize compacta 2",els[1].textContent,"DEG");
ctx.document.documentElement.dataset.density="comfortable";
get("labelize()");
T.eq("labelize confortável 1",els[0].textContent,"Redefinir");
T.eq("labelize confortável 2",els[1].textContent,"Graus");
T.done("rótulos");
