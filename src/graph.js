function graphUI(){
  const cv=$("#grCv"),ctx=cv.getContext("2d"),info=$("#grInfo");
  const COLORS=["#ffffff","#ff4d4d","#ffd23b","#3bd5ff"];
  const SAMPLES={cart:"sin(x)\nx^2/4-1",polar:"1+cos(t)\n2sin(3t)",par:"cos(t);sin(t)\n2cos(t);sin(t)"};
  const V={cx:0,cy:0,s:40};
  let W=0,H=0,trace=null,note="",errs=[],tm=0;
  const mode=()=>$("#grMode").value;
  const tx=x=>(x-V.cx)*V.s+W/2,ty=y=>H/2-(y-V.cy)*V.s;
  const wx=px=>V.cx+(px-W/2)/V.s,wy=py=>V.cy-(py-H/2)/V.s;
  const defs=()=>$("#grIn").value.split("\n").map(l=>l.trim()).filter(Boolean).slice(0,4);
  const tr=()=>{try{return [evaluate($("#grT0").value),evaluate($("#grT1").value)]}catch(e){return [0,4*Math.PI]}};
  const nice=r=>{const p=Math.pow(10,Math.floor(Math.log10(r))),f=r/p;return (f<=1?1:f<=2?2:f<=5?5:10)*p};
  const lab=v=>String(+v.toPrecision(6));
  const clamp=v=>Math.max(-1e5,Math.min(1e5,v));
  const sc1=(k,v)=>{const s=Object.create(null);s[k]=v;return s};
  function point(d,t){
    const m=mode();
    if(m==="cart")return [t,evaluate(d,sc1("x",t))];
    const s=sc1("t",t);
    if(m==="polar"){const r=evaluate(d,s);return [r*Math.cos(t),r*Math.sin(t)]}
    const p=d.split(";");
    if(p.length!==2)throw new CalcError("sintaxe","Use x(t); y(t)",0);
    return [evaluate(p[0],s),evaluate(p[1],s)];
  }
  function draw(){
    if(!W||!H)return;
    const old=st.mode;st.mode="RAD";errs=[];
    try{
      ctx.fillStyle="#0a0000";ctx.fillRect(0,0,W,H);
      const step=nice(60/V.s),x0=wx(0),x1=wx(W),y1=wy(0),y0=wy(H);
      ctx.lineWidth=1;ctx.font="11px system-ui,sans-serif";
      ctx.strokeStyle="rgba(255,255,255,.12)";ctx.beginPath();
      for(let x=Math.ceil(x0/step)*step;x<=x1;x+=step){const X=Math.round(tx(x))+.5;ctx.moveTo(X,0);ctx.lineTo(X,H)}
      for(let y=Math.ceil(y0/step)*step;y<=y1;y+=step){const Y=Math.round(ty(y))+.5;ctx.moveTo(0,Y);ctx.lineTo(W,Y)}
      ctx.stroke();
      const ax=Math.min(Math.max(tx(0),0),W),ay=Math.min(Math.max(ty(0),0),H);
      ctx.strokeStyle="rgba(255,255,255,.75)";ctx.beginPath();ctx.moveTo(ax,0);ctx.lineTo(ax,H);ctx.moveTo(0,ay);ctx.lineTo(W,ay);ctx.stroke();
      ctx.fillStyle="rgba(255,255,255,.85)";
      const ly=Math.min(Math.max(ay+13,12),H-4),lx=Math.min(Math.max(ax+4,2),W-44);
      for(let x=Math.ceil(x0/step)*step;x<=x1;x+=step)if(Math.abs(x)>step/2)ctx.fillText(lab(x),tx(x)+3,ly);
      for(let y=Math.ceil(y0/step)*step;y<=y1;y+=step)if(Math.abs(y)>step/2)ctx.fillText(lab(y),lx,ty(y)-3);
      const cart=mode()==="cart",[t0,t1]=cart?[x0,x1]:tr(),N=cart?Math.ceil(W/1.5):Math.min(40000,Math.max(1500,Math.ceil(Math.abs(t1-t0)*250)));
      defs().forEach((d,k)=>{
        ctx.strokeStyle=COLORS[k];ctx.lineWidth=2;ctx.beginPath();
        let pen=false,py=0,px=0;
        for(let i=0;i<=N;i++){
          let p;
          try{p=point(d,t0+(t1-t0)*i/N)}catch(e){
            if(e instanceof CalcError&&e.kind==="sintaxe"){errs.push("Linha "+(k+1)+": "+e.message);return}
            pen=false;continue;
          }
          if(!Number.isFinite(p[0])||!Number.isFinite(p[1])){pen=false;continue}
          const X=clamp(tx(p[0])),Y=clamp(ty(p[1]));
          if(pen&&(cart?(Math.abs(Y-py)>H*3&&(Y-H/2)*(py-H/2)<0):(Math.abs(Y-py)>H*3||Math.abs(X-px)>W*3)))pen=false;
          if(pen)ctx.lineTo(X,Y);else ctx.moveTo(X,Y);
          pen=true;py=Y;px=X;
        }
        ctx.stroke();
      });
      if(trace){ctx.fillStyle="#fff";ctx.strokeStyle="#ff2a2a";ctx.lineWidth=2;ctx.beginPath();ctx.arc(tx(trace.x),ty(trace.y),5,0,6.2832);ctx.fill();ctx.stroke()}
    }finally{st.mode=old}
    info.textContent=errs.length?errs.join(" · "):note||(trace?"x = "+fmt(trace.x)+" · y = "+fmt(trace.y):"");
  }
  function setTrace(px,py){
    note="";const x=wx(px);let y=wy(py);
    const d=defs()[0];
    if(mode()==="cart"&&d){const o=st.mode;st.mode="RAD";try{y=evaluate(d,sc1("x",x))}catch(e){y=NaN}finally{st.mode=o}}
    trace=Number.isFinite(y)?{x,y}:null;draw();
  }
  function zoom(f,px,py){
    note="";const x=wx(px),y=wy(py);
    V.s=Math.max(0.5,Math.min(5e6,V.s*f));
    V.cx=x-(px-W/2)/V.s;V.cy=y+(py-H/2)/V.s;draw();
  }
  function roots(){
    const d=defs()[0];
    if(mode()!=="cart"||!d){note="Raízes: use o modo y = f(x)";draw();return}
    const o=st.mode;st.mode="RAD";const out=[];
    try{
      const f=x=>evaluate(d,sc1("x",x));
      const a=wx(0),b=wx(W),N=800;let px=a,pf=null;
      try{pf=f(px)}catch(e){pf=null}
      for(let i=1;i<=N&&out.length<20;i++){
        const x=a+(b-a)*i/N;let fx;
        try{fx=f(x)}catch(e){pf=null;px=x;continue}
        if(pf!==null&&pf*fx<0){
          let lo=px,hi=x,fl=pf;
          for(let k=0;k<60;k++){const m=(lo+hi)/2,fm=f(m);if(fl*fm<=0)hi=m;else{lo=m;fl=fm}}
          const r=(lo+hi)/2;if(Math.abs(f(r))<1e-6)out.push(r);
        }else if(fx===0)out.push(x);
        px=x;pf=fx;
      }
    }catch(e){}finally{st.mode=o}
    note=out.length?"Raízes de linha 1 na janela: "+out.map(r=>fmt(Math.abs(r)<1e-12?0:r)).join(", "):"Nenhuma raiz na janela";
    draw();
  }
  function size(){
    W=cv.clientWidth;H=cv.clientHeight;
    const r=window.devicePixelRatio||1;
    cv.width=Math.round(W*r);cv.height=Math.round(H*r);ctx.setTransform(r,0,0,r,0,0);draw();
  }
  let drag=null;
  const pos=e=>{const r=cv.getBoundingClientRect();return [e.clientX-r.left,e.clientY-r.top]};
  cv.onpointerdown=e=>{cv.setPointerCapture(e.pointerId);drag={x:e.clientX,y:e.clientY,moved:false}};
  cv.onpointermove=e=>{
    if(drag){
      const dx=e.clientX-drag.x,dy=e.clientY-drag.y;
      if(Math.abs(dx)+Math.abs(dy)>3)drag.moved=true;
      if(drag.moved){V.cx-=dx/V.s;V.cy+=dy/V.s;drag.x=e.clientX;drag.y=e.clientY;draw();return}
    }
    setTrace(...pos(e));
  };
  cv.onpointerup=e=>{if(drag&&!drag.moved)setTrace(...pos(e));drag=null};
  cv.addEventListener("wheel",e=>{e.preventDefault();zoom(Math.pow(1.0015,-e.deltaY),...pos(e))},{passive:false});
  $("#grZi").onclick=()=>zoom(1.4,W/2,H/2);
  $("#grZo").onclick=()=>zoom(1/1.4,W/2,H/2);
  $("#grRs").onclick=()=>{V.cx=0;V.cy=0;V.s=mode()==="cart"?40:60;trace=null;note="";draw()};
  $("#grRt").onclick=roots;
  $("#grPlot").onclick=draw;
  $("#grPng").onclick=()=>{
    const save=url=>{const a=document.createElement("a");a.href=url;a.download="overkill-grafico.png";a.click()};
    if(cv.toBlob)cv.toBlob(b=>{
      if(!b){info.textContent="Não foi possível gerar o PNG";return}
      const u=URL.createObjectURL(b);save(u);setTimeout(()=>URL.revokeObjectURL(u),1000);
    });
    else try{save(cv.toDataURL("image/png"))}catch(e){info.textContent="Não foi possível gerar o PNG"}
  };
  $("#grMode").onchange=()=>{$("#grIn").value=SAMPLES[mode()];trace=null;note="";V.cx=0;V.cy=0;V.s=mode()==="cart"?40:60;draw()};
  const later=()=>{clearTimeout(tm);tm=setTimeout(draw,200)};
  $("#grIn").oninput=later;$("#grT0").oninput=later;$("#grT1").oninput=later;
  new ResizeObserver(size).observe(cv);
}
if(typeof document!=="undefined"&&document.getElementById("gr"))graphUI();
