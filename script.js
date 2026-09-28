const sources = [
 {title:'Cyberfeminism Index',author:'Mindy Seu',kind:'BOOK / INDEX',url:'https://www.inventorypress.com/product/cyberfeminism-index',theme:'a network that holds us',starts:['I leave a little light on in the network.','Somewhere, a stranger is building a room for us.','Our tabs stay open like a circle of hands.'],middles:['Every link is a possible kinship, every alias a small beginning.','We make a home from the places that forgot to invite us.','I follow the traces of other queer bodies and find room for mine.']},
 {title:'Glitch Feminism',author:'Legacy Russell',kind:'BOOK',url:'https://www.versobooks.com/products/460-glitch-feminism',theme:'a body beyond the dropdown',starts:['Tonight my avatar refuses to resolve.','I want you to meet the version of me that keeps changing.','The form asks what I am. I send you a shimmer.'],middles:['There is tenderness in being unreadable to a machine.','You let me arrive without choosing a final shape.','Our queer bodies spill beyond the boxes the interface offers.']},
 {title:'La seducción',author:'Sara Torres',kind:'BOOK · ESPAÑOL',url:'https://www.penguinlibros.com/es/novela-romantica/340377-libro-la-seduccion-9788419437808',theme:'the tenderness of waiting',starts:['Your typing dots make a tiny weather inside me.','I read your message slowly, as if slowness could bring you nearer.','Between your goodnight and my reply, a whole room opens.'],middles:['I want a closeness that leaves you room to move.','Desearte: to leave the door open without asking you to enter.','The distance is full of what we have not asked of each other.']},
 {title:'Skincare for Unruly Bodies',author:'Charlotte Rohde',kind:'ESSAY',url:'https://www.charlotterohde.de/',linkNote:'Author website; original essay PDF is unavailable',theme:'letters with a pulse',starts:['I give this sentence a softer body.','My letters lean toward you before I know what to say.','Imagine the curve of a letter as a place to rest.'],middles:['A word can blush without a face.','The screen holds a voice that will not stay inside its outline.','Even my punctuation wants to be held.']},
 {title:'Xenofeminism: A Politics for Alienation',author:'Laboria Cuboniks',kind:'MANIFESTO',url:'https://laboriacuboniks.net/manifesto/',theme:'a future we can change',starts:['We build a future with room for every version of us.','Your name is not a limit on what you can become.','Tonight we teach the network another way to care.'],middles:['No default setting gets to decide the shape of our lives.','We share the tools and leave the possibilities open.','A different world begins in what we make available to each other.']},
 {title:'Brandon',author:'Shu Lea Cheang',kind:'NET ART · ARCHIVE',url:'https://www.guggenheim.org/artwork/15337',theme:'a body across the network',starts:['I carry my chosen name from window to window.','Somewhere beyond the login, a body asks to be seen.','We leave a trace that an archive might hold gently.'],middles:['Being visible should not mean giving up the right to be safe.','The network remembers fragments; we remember a person.','I want a space where changing shape does not cost us tenderness.']}
];
const endings=['I want to be felt on the other side of the glass.','Can a cursor become a place to touch?','For a moment, the distance feels porous.','We are still becoming, even here.','Nothing about this longing is virtual.','I send a small ♡ and let it mean a body.'];
const stage=document.querySelector('main'),cloudLayer=document.querySelector('#clouds');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const pick=a=>a[Math.floor(Math.random()*a.length)];
const desires=['your voice','our unfinished selves','the warmth of a reply','a name we chose','the space between messages','this tender uncertainty','a queer future','our flickering outlines'];
const gestures=['waits beside me','travels through the wires','opens another room','refuses to become a category','lingers after midnight','finds a softer rhythm','leaves room for us to change'];
const places=['in the blue light','between one breath and the next','where the connection falters','on the other side of sleep','inside this small electric elsewhere','without asking for an explanation'];
const fonts=window.googleFontCatalog;
let fontBag=[],lastFont='',animationFrame;
let blocks=[],generation=0,lastLayout='';
const loadedStyles=[];
function chooseFont(){
 if(!fontBag.length){fontBag=[...fonts];for(let i=fontBag.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[fontBag[i],fontBag[j]]=[fontBag[j],fontBag[i]];}if(fontBag.at(-1).name===lastFont)[fontBag[0],fontBag[fontBag.length-1]]=[fontBag.at(-1),fontBag[0]];}
 const font=fontBag.pop();lastFont=font.name;return font;
}
stage.replaceChildren();
function sentence(source){return pick([()=>pick(source.starts),()=>pick(source.middles),()=>pick(endings),()=>{const subject=pick(desires);return subject[0].toUpperCase()+subject.slice(1)+' '+pick(gestures)+' '+pick(places)+'.';}])();}
function heart(source){const a=document.createElement('a');a.textContent='♥︎';a.href=source.url;a.target='_blank';a.rel='noopener noreferrer';a.title=`${source.title} — ${source.author}${source.linkNote?' · '+source.linkNote:''}`;a.setAttribute('aria-label',`Reference: ${source.title} by ${source.author}${source.linkNote?'. '+source.linkNote:''}`);return a;}
// Subdivide a ten-by-ten grid into differently sized, non-overlapping regions.
function makeGrid(width,height){
 const minW=Math.max(1,Math.ceil(115/(width/10))),minH=Math.max(1,Math.ceil(65/(height/10)));
 const regions=[{x:0,y:0,w:10,h:10}],target=width<600?7:10;
 while(regions.length<target){
  const candidates=regions.filter(r=>r.w>=minW*2||r.h>=minH*2);
  if(!candidates.length)break;
  const region=candidates.sort((a,b)=>b.w*b.h-a.w*a.h)[Math.floor(Math.random()*Math.min(2,candidates.length))];
  const vertical=region.w>=minW*2&&(region.h<minH*2||Math.random()<.55);
  const size=vertical?region.w:region.h,min=vertical?minW:minH;
  const cut=Math.random()<.7?(Math.random()<.5?min:size-min):min+Math.floor(Math.random()*(size-min*2+1));
  const first={...region},second={...region};
  if(vertical){first.w=cut;second.x+=cut;second.w-=cut;}else{first.h=cut;second.y+=cut;second.h-=cut;}
  regions.splice(regions.indexOf(region),1,first,second);
 }
 // Exaggerate the contrast: only one-tenth-width strips may stay tall.
 const balanced=regions.flatMap(region=>{
  if(region.w===1||region.h<=4)return [region];
  const pieces=[];let remaining=region.h,y=region.y;
  while(remaining>4){const cut=2+Math.floor(Math.random()*2);pieces.push({...region,y,h:cut});y+=cut;remaining-=cut;}
  pieces.push({...region,y,h:remaining});return pieces;
 });
 const shaped=balanced.flatMap(region=>{
  if(region.w<5||region.h<=2)return [region];
  const short=1+Math.floor(Math.random()*2);
  return [{...region,h:short},{...region,y:region.y+short,h:region.h-short}];
 });
 function neighbors(a,b){
  const overlapX=a.x<b.x+b.w&&b.x<a.x+a.w,overlapY=a.y<b.y+b.h&&b.y<a.y+a.h;
  return (overlapX&&(a.y+a.h===b.y||b.y+b.h===a.y))||(overlapY&&(a.x+a.w===b.x||b.x+b.w===a.x));
 }
 // Interrupt adjacent wide rows with columns, rather than another broad stripe.
 for(let i=0;i<shaped.length;i++){
  const region=shaped[i];
  if(region.w>=5&&(region.h>2||shaped.some((other,j)=>j!==i&&other.w>=5&&neighbors(region,other)))){
   const widths=[];let remaining=region.w;
   while(remaining>4){const part=2+Math.floor(Math.random()*2);widths.push(part);remaining-=part;}widths.push(remaining);
   let x=region.x;const pieces=widths.map(w=>{const piece={...region,x,w};x+=w;return piece;});
   shaped.splice(i,1,...pieces);i+=pieces.length-1;
  }
 }
 return shaped.sort((a,b)=>a.y-b.y||a.x-b.x);
}
function passageText(source){return sentence(source)+' '+sentence(source);}
function referenceOnce(source,linked){
 if(linked.has(source.url))return null;
 linked.add(source.url);return heart(source);
}
async function loadFonts(selected){
 const link=document.createElement('link');link.rel='stylesheet';
 link.href='https://fonts.googleapis.com/css2?'+selected.map(font=>'family='+encodeURIComponent(font.name)+':ital,wght@'+font.italic+','+font.weight).join('&')+'&display=swap';
 const cssReady=new Promise(resolve=>{link.onload=()=>resolve();link.onerror=()=>resolve();});document.head.append(link);loadedStyles.push(link);
 while(loadedStyles.length>4)loadedStyles.shift().remove();
 await Promise.race([cssReady,new Promise(resolve=>setTimeout(resolve,5000))]);
 await Promise.all(selected.map(async font=>{
  const descriptor=`${font.italic?'italic':'normal'} ${font.weight} 20px "${font.name}"`;
  try{const result=await Promise.race([document.fonts.load(descriptor),new Promise(resolve=>setTimeout(()=>resolve([]),5000))]);font.loaded=result.length>0;}catch{font.loaded=false;}
 }));
}
async function newPassage(){
 const version=++generation;
 cancelAnimationFrame(animationFrame);blocks=[];stage.replaceChildren();fontBag=[];refreshClouds();
 const grid=document.createElement('div');grid.className='poetry-grid';stage.append(grid);
 let regions;let signature;let attempts=0;
 do{regions=makeGrid(grid.clientWidth,grid.clientHeight);signature=JSON.stringify(regions);}while(signature===lastLayout&&++attempts<20);
 lastLayout=signature;
 const selected=regions.map(()=>({...chooseFont()}));
 await loadFonts(selected);if(version!==generation)return;
 const sourceOrder=[...sources];
 for(let i=sourceOrder.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[sourceOrder[i],sourceOrder[j]]=[sourceOrder[j],sourceOrder[i]];}
 const linked=new Set();
 let fontIndex=0;
 for(const region of regions){
  const source=sourceOrder[fontIndex%sourceOrder.length],font=selected[fontIndex++];
  const cell=document.createElement('section');cell.className='poem-cell '+font.kind;
  cell.style.gridColumn=`${region.x+1} / span ${region.w}`;cell.style.gridRow=`${region.y+1} / span ${region.h}`;
  cell.style.fontFamily=font.loaded?`'${font.name}', ${font.fallback}`:font.fallback;
  cell.style.fontWeight=font.weight;cell.style.fontStyle=font.italic?'italic':'normal';
  cell.setAttribute('aria-label','Original generative poetry inspired by '+source.title);
  const poem=document.createElement('p'),reference=referenceOnce(source,linked);
  cell.append(poem);if(reference)cell.append(reference);grid.append(cell);
  const text=passageText(source),node=document.createElement('span');poem.append(node);
  blocks.push({poem,node,text,source,speed:18+Math.random()*10,started:performance.now(),history:[]});
 }
 function tick(now){
  for(const block of blocks){
   const elapsed=now-block.started;
   // Reduced motion refreshes whole passages at a reading pace.
   const length=reduced.matches?block.text.length:Math.floor(elapsed*block.speed/1000);
   block.node.textContent=block.text.slice(0,length);
   while(block.history.length&&block.history[0].expires<=now)block.history.shift().node.remove();
   const duration=reduced.matches?Math.max(15000,block.text.length*100):block.text.length/block.speed*1000;
   if(elapsed>=duration)continueBlock(block,now);
  }
  animationFrame=requestAnimationFrame(tick);
 }
 animationFrame=requestAnimationFrame(tick);
}
function continueBlock(block,now){
 // Keep completed words for at least 45 seconds while the next passage types.
 block.node.textContent=block.text+' ';
 block.history.push({node:block.node,expires:now+Math.max(45000,block.text.length*100)});
 const previous=block.text;
 for(let attempt=0;attempt<3;attempt++){
  block.text=passageText(block.source);
  if(block.text!==previous)break;
 }
 block.node=document.createElement('span');block.poem.append(block.node);
 block.started=now;
}

function refreshClouds(){
 cloudLayer.getAnimations({subtree:true}).forEach(a=>a.cancel());cloudLayer.replaceChildren();
 const cloudCount=5;
 const band=(innerHeight-30)/cloudCount;
 const occupied=[];
 for(let i=0;i<cloudCount;i++){
  const art=document.createElement('div');art.className='heart-cloud';art.style.color='#ffffff';
  const cols=66,rows=28,phase=Math.random()*6;
  const lobes=[{x:9,y:8,rx:6+Math.random(),ry:3.4+Math.random()*.8},{x:14+Math.random()*2,y:5.2+Math.random(),rx:5+Math.random(),ry:3.8+Math.random()*.7},{x:21+Math.random()*2,y:6.5+Math.random(),rx:5+Math.random(),ry:3.5+Math.random()*.8},{x:27,y:9,rx:4+Math.random()*.6,ry:2.7+Math.random()*.5},{x:17,y:10,rx:12+Math.random(),ry:2.5+Math.random()*.4}];
  for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){
   const cell=document.createElement('span'),wx=x/2+Math.sin(y*.25+phase)*.35,wy=y/2+Math.sin(x*.19+phase)*.3;
   if(lobes.some(l=>((wx-l.x)/l.rx)**2+((wy-l.y)/l.ry)**2<=1))cell.textContent=pick(['♥︎','♥︎','✴','✴','✧','·']);art.append(cell);
  }
  const width=Math.min(innerWidth*.8,band*.98/.42,900),height=width*.42;
  art.style.width=width+'px';art.style.height=height+'px';art.style.fontSize=Math.min(width/cols,height/rows)*.95+'px';cloudLayer.append(art);
  const maxX=Math.max(12,innerWidth-width-12),maxY=Math.max(12,innerHeight-height-12);
  let x,y,placed=false;
  for(let attempt=0;attempt<150;attempt++){
   x=12+Math.random()*(maxX-12);y=12+Math.random()*(maxY-12);
   if(occupied.every(r=>x+width+12<r.x||r.x+r.width+12<x||y+height+12<r.y||r.y+r.height+12<y)){placed=true;break;}
  }
  if(!placed){
   // A separated band layout is a reliable fallback on narrow screens.
   occupied.length=0;
   [...cloudLayer.querySelectorAll('.heart-cloud')].slice(0,-1).forEach((previous,j)=>{
    previous.getAnimations().forEach(a=>a.cancel());
    previous.style.transform=`translate(12px,${15+j*band+(band-height)/2}px)`;
    if(!reduced.matches)previous.animate([{transform:previous.style.transform},{transform:`translate(${maxX}px,${15+j*band+(band-height)/2}px)`}],{duration:100000+j*12000,iterations:Infinity,direction:'alternate',easing:'linear'});
   });
   x=12+Math.random()*(maxX-12);y=15+i*band+(band-height)/2;
  }
  occupied.push({x,y,width,height});
  const endX=x<maxX/2?maxX:12;
  const endY=Math.max(12,Math.min(maxY,y+(Math.random()<.5?-1:1)*innerHeight*.25));
  art.style.transform=`translate(${x}px,${y}px)`;
  if(!reduced.matches)art.animate([{transform:`translate(${x}px,${y}px)`},{transform:`translate(${endX}px,${endY}px)`}],{duration:95000+Math.random()*45000,iterations:Infinity,direction:'alternate',easing:'linear'});
 }
 // Jittered cells spread the texture across the full sky without dense clumps.
 const textureCols=Math.max(12,Math.ceil(innerWidth/55)),textureRows=Math.max(12,Math.ceil(innerHeight/45));
 for(let y=0;y<textureRows;y++)for(let x=0;x<textureCols;x++){
  const mote=document.createElement('span');mote.className='texture';mote.textContent=pick(['♥︎','♥︎','✴','✴','♡','✧']);
  mote.style.left=((x+.15+Math.random()*.7)/textureCols*98)+'%';mote.style.top=((y+.15+Math.random()*.7)/textureRows*98)+'%';
  mote.style.fontSize=(4+Math.random()*4)+'px';mote.style.opacity=String(.16+Math.random()*.16);mote.style.transform=`rotate(${Math.random()*50-25}deg)`;cloudLayer.append(mote);
 }
}
stage.addEventListener('click',e=>{if(!e.target.closest('a'))newPassage();});
document.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();newPassage();}});
let resizeTimer;window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(newPassage,180);});
newPassage();
