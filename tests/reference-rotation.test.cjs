const {test}=require('node:test');
const assert=require('node:assert/strict');
const {createReferenceRotation}=require('../reference-rotation.js');
const catalog=Array.from({length:12},(_,i)=>({url:`https://example.org/${i}`}));
function storage(initial=null){let value=initial;return {getItem(){return value;},setItem(key,next){value=next;}};}
test('reloads show unseen URLs until the pool is exhausted',()=>{
 const saved=storage(),seen=new Set();let previous=[];
 for(let refresh=0;refresh<4;refresh++){
  const batch=createReferenceRotation(catalog,saved)(3);
  assert.equal(batch.length,3);
  for(const source of batch){assert.ok(!seen.has(source.url));seen.add(source.url);}
  previous=batch;
 }
 const next=createReferenceRotation(catalog,saved)(3);
 assert.equal(seen.size,12);
 assert.ok(next.every(source=>!previous.some(old=>old.url===source.url)));
});
test('first upgraded visits start with the six new references',()=>{
 const saved=storage(),original=catalog.slice(0,6).map(source=>source.url),seen=new Set(original);
 for(let refresh=0;refresh<2;refresh++){
  const batch=createReferenceRotation(catalog,saved,original)(3);
  assert.equal(batch.length,3);
  for(const source of batch){assert.ok(!seen.has(source.url));seen.add(source.url);}
 }
 assert.equal(seen.size,12);
});
test('partial batches never fill with already seen references',()=>{
 const next=createReferenceRotation(catalog.slice(0,4),storage());
 const first=next(3),last=next(3);
 assert.equal(last.length,1);
 assert.ok(!first.some(source=>source.url===last[0].url));
});
test('disabled storage still rotates within the current visit',()=>{
 const next=createReferenceRotation(catalog,{getItem(){throw Error();},setItem(){throw Error();}});
 const seen=new Set();
 for(let i=0;i<4;i++)for(const source of next(3)){assert.ok(!seen.has(source.url));seen.add(source.url);}
});
test('malformed storage does not prevent selection',()=>{
 for(const value of ['{','null','{"seen":12,"last":false}'])assert.equal(createReferenceRotation(catalog,storage(value))(3).length,3);
});
test('catalog changes preserve history by URL and discover new entries',()=>{
 const saved=storage();createReferenceRotation(catalog.slice(0,3),saved)(3);
 const added=catalog[3];
 assert.deepEqual(createReferenceRotation([added,...catalog.slice(0,3).reverse()],saved)(3),[added]);
});
