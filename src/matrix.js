const LA={
  parse(text){
    const rows=text.trim().split(/\s*(?:;|\n)\s*/).filter(r=>r.length);
    if(!rows.length)throw new CalcError("sintaxe","Matriz vazia",0);
    const M=rows.map(r=>r.trim().split(/[\s,]+/).map(c=>evaluate(c)));
    if(M.some(r=>r.length!==M[0].length))throw new CalcError("dimensão","As linhas têm tamanhos diferentes",0);
    if(M.length>12||M[0].length>12)throw new CalcError("numérico","Limite de 12×12",0);
    return M;
  },
  T:M=>M[0].map((_,j)=>M.map(r=>r[j])),
  mul(A,B){
    if(A[0].length!==B.length)throw new CalcError("dimensão","Dimensões incompatíveis: "+A.length+"×"+A[0].length+" e "+B.length+"×"+B[0].length,0);
    return A.map(r=>B[0].map((_,j)=>r.reduce((s,v,k)=>s+v*B[k][j],0)));
  },
  gauss(A,B){
    const n=A.length,w=A[0].length,m=A.map((r,i)=>[...r,...B[i]]);
    const sc=Math.max(...A.flat().map(Math.abs),1e-300);
    let det=1,rank=0;
    for(let c=0,r=0;c<w&&r<n;c++){
      let p=r;for(let i=r+1;i<n;i++)if(Math.abs(m[i][c])>Math.abs(m[p][c]))p=i;
      if(Math.abs(m[p][c])<1e-12*sc)continue;
      if(p!==r){[m[p],m[r]]=[m[r],m[p]];det=-det}
      const pv=m[r][c];det*=pv;m[r]=m[r].map(v=>v/pv);
      for(let i=0;i<n;i++)if(i!==r){const f=m[i][c];if(f)m[i]=m[i].map((v,k)=>v-f*m[r][k])}
      r++;rank++;
    }
    return {m,rank,det:rank===n&&n===w?det:0};
  },
  square(A){if(A.length!==A[0].length)throw new CalcError("dimensão","A operação exige matriz quadrada",0)},
  det(A){LA.square(A);return LA.gauss(A,A.map(()=>[])).det},
  rank(A){return LA.gauss(A,A.map(()=>[])).rank},
  norm1:M=>Math.max(...LA.T(M).map(c=>c.reduce((s,v)=>s+Math.abs(v),0))),
  inv(A){
    LA.square(A);const n=A.length;
    const g=LA.gauss(A,A.map((_,i)=>A.map((_,j)=>i===j?1:0)));
    if(g.rank<n)throw new CalcError("domínio","Matriz singular: não tem inversa",0);
    const X=g.m.map(r=>r.slice(n));
    return {X,cond:LA.norm1(A)*LA.norm1(X)};
  },
  solve(A,b){
    LA.square(A);const n=A.length;
    if(b.length!==n||b[0].length!==1)throw new CalcError("dimensão","b deve ser um vetor coluna com "+n+" linhas",0);
    const g=LA.gauss(A,b);
    if(g.rank<n)throw new CalcError("domínio","Sistema sem solução única: matriz singular",0);
    const X=g.m.map(r=>r.slice(n));
    const res=Math.max(...LA.mul(A,X).map((r,i)=>Math.abs(r[0]-b[i][0])));
    return {X,res};
  },
  show:M=>M.map(r=>r.map(v=>fmt(v)).join("  ")).join("\n")
};
function matUI(){
  const out=$("#matOut");
  const run=()=>{
    const op=$("#matOp").value;
    try{
      const A=LA.parse($("#matA").value);
      const B=op==="mul"||op==="solve"?LA.parse($("#matB").value):null;
      let t;
      if(op==="det")t="det(A) = "+fmt(LA.det(A));
      else if(op==="rank")t="posto(A) = "+LA.rank(A);
      else if(op==="T")t=LA.show(LA.T(A));
      else if(op==="mul")t=LA.show(LA.mul(A,B));
      else if(op==="inv"){const r=LA.inv(A);t=LA.show(r.X)+"\n\ncondicionamento (norma 1) ≈ "+r.cond.toExponential(2)+(r.cond>1e10?"\naviso: matriz mal condicionada, o resultado pode ser impreciso":"")}
      else{const r=LA.solve(A,B);t="x =\n"+LA.show(r.X)+"\n\nmétodo: eliminação de Gauss-Jordan com pivotamento parcial\nresíduo máx |Ax−b| ≈ "+r.res.toExponential(2)}
      out.textContent=t;
    }catch(e){out.textContent=errText(e)}
  };
  $("#matGo").onclick=run;
}
if(typeof document!=="undefined"&&document.getElementById("mat"))matUI();
