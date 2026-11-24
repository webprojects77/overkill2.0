// Rótulos em duas densidades.
// Confortável (padrão): palavra inteira ("Decimal", "Graus").
// Compacta: abreviação ("Dec", "DEG").
// Elementos estáticos usam data-full e data-short; labelize() troca o texto.
// Textos gerados pelo JS usam lbl(short, full) no momento de escrever.
// Ao trocar a densidade, applyPrefs() chama labelize() e dispara "labels:change".

function densityNow(){
  return typeof document!=="undefined"&&document.documentElement.dataset.density==="compact"?"compact":"comfortable";
}
function lbl(short,full){return densityNow()==="compact"?short:full}
function labelize(root){
  if(typeof document==="undefined")return;
  (root||document).querySelectorAll("[data-full][data-short]").forEach(el=>{
    el.textContent=densityNow()==="compact"?el.dataset.short:el.dataset.full;
  });
}
