const TL={
  units:{
    "Comprimento":{m:1,mm:.001,cm:.01,km:1000,"in":.0254,ft:.3048,yd:.9144,mi:1609.344,nmi:1852,au:149597870700,ly:9460730472580800,pc:3.0856775814913673e16},
    "Massa":{kg:1,mg:1e-6,g:.001,t:1000,oz:.028349523125,lb:.45359237},
    "Tempo":{s:1,ms:.001,min:60,h:3600,d:86400,sem:604800},
    "Área":{"m²":1,"cm²":1e-4,ha:1e4,"km²":1e6,"in²":6.4516e-4,"ft²":.09290304,ac:4046.8564224},
    "Volume":{L:1,mL:.001,"m³":1000,gal:3.785411784,copo:.2365882365,"fl oz":.0295735295625},
    "Velocidade":{"m/s":1,"km/h":1/3.6,mph:.44704,kn:1852/3600,c:299792458},
    "Energia":{J:1,kJ:1000,cal:4.184,kcal:4184,Wh:3600,kWh:3.6e6,eV:1.602176634e-19},
    "Pressão":{Pa:1,kPa:1000,bar:1e5,atm:101325,psi:6894.757293168,mmHg:133.322387415},
    "Dados":{B:1,bit:.125,KB:1e3,MB:1e6,GB:1e9,TB:1e12,KiB:1024,MiB:1048576,GiB:1073741824},
    "Temperatura":{"°C":0,"°F":0,K:0}
  },
  toK:{"°C":v=>v+273.15,"°F":v=>(v-32)*5/9+273.15,K:v=>v},
  fromK:{"°C":k=>k-273.15,"°F":k=>(k-273.15)*9/5+32,K:k=>k},
  convert(cat,v,f,t){
    const u=TL.units[cat];
    if(!Object.hasOwn(u,f)||!Object.hasOwn(u,t))throw new CalcError("unidade","Unidade fora da categoria “"+cat+"”",0);
    if(cat==="Temperatura"){
      const k=TL.toK[f](v);
      if(k<0)throw new CalcError("domínio","Abaixo do zero absoluto",0);
      return TL.fromK[t](k);
    }
    return v*u[f]/u[t];
  },
  parseBase(s,b){
    s=s.trim().toLowerCase().replace(/_/g,"");
    let neg=false,i=0;
    if(s[0]==="-"){neg=true;i=1}
    if(i>=s.length)throw new CalcError("sintaxe","Número vazio",0);
    if(s.length>200)throw new CalcError("numérico","Limite de 200 dígitos",0);
    let v=0n;const B=BigInt(b);
    for(;i<s.length;i++){
      const d=parseInt(s[i],36);
      if(Number.isNaN(d)||d>=b)throw new CalcError("sintaxe","Dígito inválido “"+s[i]+"” para a base "+b,i);
      v=v*B+BigInt(d);
    }
    return neg?-v:v;
  },
  bits(op,A,B,w){
    const W=BigInt(w),ua=BigInt.asUintN(w,A),ub=BigInt.asUintN(w,B);
    let r,lost=false;
    if(op==="and")r=ua&ub;else if(op==="or")r=ua|ub;else if(op==="xor")r=ua^ub;else if(op==="not")r=~ua;
    else{
      if(ub>=W)throw new CalcError("domínio","Deslocamento deve estar entre 0 e "+(w-1),0);
      if(op==="shl"){r=ua<<ub;lost=(r>>W)!==0n}else r=ua>>ub;
    }
    r=BigInt.asUintN(w,r);
    const bin=r.toString(2).padStart(w,"0").replace(/(.{4})(?=.)/g,"$1 ");
    return "decimal (sem sinal): "+r+"\ndecimal (complemento de dois): "+BigInt.asIntN(w,r)+"\nhex: 0x"+r.toString(16).toUpperCase().padStart(w/4,"0")+"\nbin: "+bin+(lost?"\naviso: bits perdidos no deslocamento":"");
  },
  fp(x){
    const d=new DataView(new ArrayBuffer(8));
    d.setFloat64(0,x);const b=d.getBigUint64(0),s=b.toString(2).padStart(64,"0");
    const e=Number((b>>52n)&0x7ffn),kind=e===0?(x===0?"zero":"subnormal"):"normal";
    const f32=Math.fround(x);d.setFloat32(0,x);const c=d.getUint32(0),s32=c.toString(2).padStart(32,"0");
    return "double (64 bits)\n  sinal "+s[0]+" | expoente "+s.slice(1,12)+" | mantissa "+s.slice(12)+"\n  hex 0x"+b.toString(16).padStart(16,"0")+"\n  expoente "+e+" (viés 1023) → "+(e-1023)+" · "+kind+"\n  valor armazenado: "+x.toPrecision(17)+"\n\nfloat (32 bits)\n  sinal "+s32[0]+" | expoente "+s32.slice(1,9)+" | mantissa "+s32.slice(9)+"\n  hex 0x"+c.toString(16).padStart(8,"0")+"\n  valor armazenado: "+f32.toPrecision(9)+"\n  erro de arredondamento: "+(x-f32).toExponential(2);
  },
  color(s){
    s=s.trim().toLowerCase();let r,g,b,m;
    const bad=()=>new CalcError("sintaxe","Use #rrggbb, rgb(r, g, b) ou hsl(h, s%, l%) com valores válidos",0);
    if((m=s.match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/))){
      let h=m[1];if(h.length===3)h=[...h].map(c=>c+c).join("");
      r=parseInt(h.slice(0,2),16);g=parseInt(h.slice(2,4),16);b=parseInt(h.slice(4),16);
    }else if((m=s.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/))){
      [r,g,b]=m.slice(1).map(Number);if([r,g,b].some(v=>v>255))throw bad();
    }else if((m=s.match(/^hsl\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)%\s*,\s*(\d+(?:\.\d+)?)%\s*\)$/))){
      const [h,sa,l]=m.slice(1).map(Number);if(h>360||sa>100||l>100)throw bad();
      const S=sa/100,L=l/100,k=n=>(n+h/30)%12,a=S*Math.min(L,1-L),f=n=>L-a*Math.max(-1,Math.min(k(n)-3,9-k(n),1));
      r=Math.round(255*f(0));g=Math.round(255*f(8));b=Math.round(255*f(4));
    }else throw bad();
    const R=r/255,G=g/255,B=b/255,mx=Math.max(R,G,B),mn=Math.min(R,G,B),d=mx-mn,L=(mx+mn)/2;
    let H=0;if(d){H=mx===R?((G-B)/d)%6:mx===G?(B-R)/d+2:(R-G)/d+4;H*=60;if(H<0)H+=360}
    const S=d?d/(1-Math.abs(2*L-1)):0;
    const hex="#"+[r,g,b].map(v=>v.toString(16).padStart(2,"0")).join("");
    return {hex,text:"hex: "+hex+"\nrgb("+r+", "+g+", "+b+")\nhsl("+Math.round(H)+", "+Math.round(S*100)+"%, "+Math.round(L*100)+"%)"};
  }
};
function toolsUI(){
  const sel=$("#tlSel");
  const fill=(el,list,v)=>{el.textContent="";list.forEach(k=>{const o=document.createElement("option");o.value=k;o.textContent=k;el.append(o)});if(v!==undefined)el.value=v};
  const guard=(out,fn)=>()=>{try{out.textContent=fn()}catch(e){out.textContent=errText(e)}};
  const runUn=guard($("#unOut"),()=>{
    const cat=$("#unCat").value,v=evaluate($("#unVal").value),f=$("#unFrom").value,t=$("#unTo").value;
    const all=Object.keys(TL.units[cat]).map(u=>fmt(TL.convert(cat,v,f,u))+" "+u).join("\n");
    return fmt(v)+" "+f+" = "+fmt(TL.convert(cat,v,f,t))+" "+t+"\n\nTodas as unidades:\n"+all;
  });
  const runBs=guard($("#bsOut"),()=>{
    const base=parseInt($("#bsBase").value,10),op=$("#bsOp").value,w=parseInt($("#bsW").value,10);
    const A=TL.parseBase($("#bsIn").value,base);
    const conv=[2,8,10,16,32,36].map(b=>"base "+b+": "+A.toString(b)).join("\n");
    const B=op==="not"?0n:TL.parseBase($("#bsB").value,base);
    return conv+"\n\nA "+op.toUpperCase()+(op==="not"?"":" B")+" ("+w+" bits)\n"+TL.bits(op,A,B,w);
  });
  const runFp=guard($("#fpOut"),()=>TL.fp(evaluate($("#fpIn").value)));
  const runCl=guard($("#clOut"),()=>{const r=TL.color($("#clIn").value);$("#sw").style.backgroundColor=r.hex;return r.text});
  fill($("#unCat"),Object.keys(TL.units));
  const units=()=>{const k=Object.keys(TL.units[$("#unCat").value]);fill($("#unFrom"),k,k[0]);fill($("#unTo"),k,k[1]);runUn()};
  $("#unCat").onchange=units;$("#unVal").oninput=runUn;$("#unFrom").onchange=runUn;$("#unTo").onchange=runUn;
  fill($("#bsBase"),Array.from({length:35},(_,i)=>String(i+2)),"10");
  $("#bsIn").oninput=runBs;$("#bsB").oninput=runBs;$("#bsBase").onchange=runBs;$("#bsOp").onchange=runBs;$("#bsW").onchange=runBs;
  $("#fpIn").oninput=runFp;$("#clIn").oninput=runCl;
  sel.onchange=()=>document.querySelectorAll("[data-tool]").forEach(d=>{d.hidden=d.dataset.tool!==sel.value});
  units();runBs();runFp();runCl();
}
if(typeof document!=="undefined"&&document.getElementById("tl"))toolsUI();
