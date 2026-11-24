const fs=require("fs"),crypto=require("crypto"),path=require("path");
const root=path.join(__dirname,"..");
function files(){
  const s=fs.readFileSync(path.join(root,"sw.js"),"utf8");
  const m=s.match(/const FILES=\[(.*?)\];/s);
  return JSON.parse("["+m[1]+"]");
}
function hash(){
  const h=crypto.createHash("sha1");
  for(const f of files().filter(f=>f!=="./").sort()){h.update(f);h.update(fs.readFileSync(path.join(root,f)))}
  return h.digest("hex").slice(0,8);
}
if(require.main===module){
  const p=path.join(root,"sw.js");
  const s=fs.readFileSync(p,"utf8").replace(/const V="[^"]*";/,'const V="overkill-'+hash()+'";');
  fs.writeFileSync(p,s);
  console.log("sw.js carimbado:",hash());
}
module.exports={files,hash};
