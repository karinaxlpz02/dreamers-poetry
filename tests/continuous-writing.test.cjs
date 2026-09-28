const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const script=fs.readFileSync('script.js','utf8');
for(const reducedMotion of [false,true])test(`passages renew indefinitely (reduced motion: ${reducedMotion})`,()=>{
 const start=script.indexOf(' function tick(now){');
 const end=script.indexOf('\n animationFrame=requestAnimationFrame(tick);',start);
 const renewStart=script.indexOf('function continueBlock(');
 const renewEnd=script.indexOf('\nfunction refreshClouds()',renewStart);
 const node={data:''};
 const poem={append(n){assert.equal(n,node);}};
 const block={text:'A beginning.',node,poem,source:{},speed:60,started:0,available:100};
 let scheduled=0,renewals=0;
 const context={blocks:[block],reduced:{matches:reducedMotion},animationFrame:null,requestAnimationFrame(){scheduled++;},fillBlock(){return `Fresh passage ${++renewals}.`;}};
 vm.createContext(context);
 vm.runInContext(script.slice(start,end)+'\n'+script.slice(renewStart,renewEnd),context);
 for(let cycle=1;cycle<=100;cycle++){
  vm.runInContext(`tick(${cycle*10000});`,context);
  assert.equal(block.started,cycle*10000);
  assert.equal(block.text,`Fresh passage ${cycle}.`);
  vm.runInContext(`tick(${cycle*10000+100});`,context);
  assert.ok(node.data.startsWith('Fresh '),'new text must actually be displayed');
 }
 assert.equal(renewals,100);
 assert.equal(scheduled,200);
});
