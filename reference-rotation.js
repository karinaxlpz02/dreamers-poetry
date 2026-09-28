// Persist displayed URLs, rather than array positions, so new references stay unseen.
function createReferenceRotation(catalog,storage,initialSeen=[]){
 const key='dreamers-poetry.references.v1';
 const unique=[...new Map(catalog.map(source=>[source.url,source])).values()];
 const valid=new Set(unique.map(source=>source.url));
 let memory={seen:initialSeen.filter(url=>valid.has(url)),last:[]};
 function read(){
  try{
   const saved=JSON.parse(storage.getItem(key));
   if(saved&&Array.isArray(saved.seen)&&Array.isArray(saved.last)){
    memory={seen:saved.seen.filter(url=>valid.has(url)),last:saved.last.filter(url=>valid.has(url))};
   }
  }catch{/* Storage may be disabled; keep rotation working for this visit. */}
  return memory;
 }
 return function next(count=3){
  const state=read();
  let seen=new Set(state.seen),available=unique.filter(source=>!seen.has(source.url));
  if(!available.length){
   seen=new Set();
   const last=new Set(state.last);
   available=unique.filter(source=>!last.has(source.url));
   if(!available.length)available=[...unique];
  }
  for(let i=available.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[available[i],available[j]]=[available[j],available[i]];}
  // Do not fill a partial last batch with already-seen links.
  const selected=available.slice(0,count);
  selected.forEach(source=>seen.add(source.url));
  memory={seen:[...seen],last:selected.map(source=>source.url)};
  try{storage.setItem(key,JSON.stringify(memory));}catch{}
  return selected;
 };
}
if(typeof module!=='undefined')module.exports={createReferenceRotation};
