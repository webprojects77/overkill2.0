const fs=require("fs"),path=require("path"),{spawnSync}=require("child_process");
const files=fs.readdirSync(__dirname).filter(f=>f.endsWith(".test.js")).sort();
let bad=0;
for(const f of files){
  const r=spawnSync(process.execPath,[path.join(__dirname,f)],{encoding:"utf8"});
  process.stdout.write(r.stdout);
  if(r.stderr)process.stderr.write(r.stderr);
  if(r.status!==0){bad++;console.log("✗ "+f+" falhou")}
}
console.log(bad?bad+" arquivo(s) de teste com falhas":"todos os "+files.length+" arquivos de teste passaram");
process.exit(bad?1:0);
