const sources = [
 {title:'Cyberfeminism Index',author:'Mindy Seu',kind:'LIVING ARCHIVE',url:'https://cyberfeminismindex.com',theme:'a network that holds us',starts:['I leave a little light on in the network.','Somewhere, a stranger is building a room for us.','Our tabs stay open like a circle of hands.'],middles:['Every link is a possible kinship, every alias a small beginning.','We make a home from the places that forgot to invite us.','I follow the traces of other queer bodies and find room for mine.']},
 {title:'Glitch Feminism',author:'Legacy Russell',kind:'BOOK',url:'https://www.versobooks.com/products/460-glitch-feminism',theme:'a body beyond the dropdown',starts:['Tonight my avatar refuses to resolve.','I want you to meet the version of me that keeps changing.','The form asks what I am. I send you a shimmer.'],middles:['There is tenderness in being unreadable to a machine.','You let me arrive without choosing a final shape.','Our queer bodies spill beyond the boxes the interface offers.']},
 {title:'La seducción',author:'Sara Torres',kind:'BOOK · ESPAÑOL',url:'https://www.penguinlibros.com/es/novela-romantica/340377-libro-la-seduccion-9788419437808',theme:'the tenderness of waiting',starts:['Your typing dots make a tiny weather inside me.','I read your message slowly, as if slowness could bring you nearer.','Between your goodnight and my reply, a whole room opens.'],middles:['I want a closeness that leaves you room to move.','Desearte: to leave the door open without asking you to enter.','The distance is full of what we have not asked of each other.']},
 {title:'Skincare for Unruly Bodies',author:'Charlotte Rohde',kind:'ESSAY / PDF',url:'https://sandberg.nl/media/document/original/thesis_rohde.pdf',theme:'letters with a pulse',starts:['I give this sentence a softer body.','My letters lean toward you before I know what to say.','Imagine the curve of a letter as a place to rest.'],middles:['A word can blush without a face.','The screen holds a voice that will not stay inside its outline.','Even my punctuation wants to be held.']}
];
const endings=['I want to be felt on the other side of the glass.','Can a cursor become a place to touch?','For a moment, the distance feels porous.','We are still becoming, even here.','Nothing about this longing is virtual.','I send a small ♡ and let it mean a body.'];
const stage=document.querySelector('main'),cloudLayer=document.querySelector('#clouds');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const pick=a=>a[Math.floor(Math.random()*a.length)];
const desires=['your voice','our unfinished selves','the warmth of a reply','a name we chose','the space between messages','this tender uncertainty','a queer future','our flickering outlines'];
const gestures=['waits beside me','travels through the wires','opens another room','refuses to become a category','lingers after midnight','finds a softer rhythm','leaves room for us to change'];
const places=['in the blue light','between one breath and the next','where the connection falters','on the other side of sleep','inside this small electric elsewhere','without asking for an explanation'];
const fonts=[{name:'VT323',kind:'pixel'},{name:'DotGothic16',kind:'pixel'},{name:'Pixelify Sans',kind:'pixel'},{name:'Parisienne',kind:'cursive'},{name:'Sacramento',kind:'cursive'},{name:'Allura',kind:'cursive'},{name:'Great Vibes',kind:'cursive'}];
let fontBag=[],lastFont='',lastSource=-1,timer,continuation,current;
function chooseFont(){
 if(!fontBag.length){fontBag=[...fonts];for(let i=fontBag.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[fontBag[i],fontBag[j]]=[fontBag[j],fontBag[i]];}if(fontBag.at(-1).name===lastFont)[fontBag[0],fontBag[fontBag.length-1]]=[fontBag.at(-1),fontBag[0]];}
 const font=fontBag.pop();lastFont=font.name;return font;
}
stage.replaceChildren();
function sentence(source){return pick([()=>pick(source.starts),()=>pick(source.middles),()=>pick(endings),()=>{const subject=pick(desires);return subject[0].toUpperCase()+subject.slice(1)+' '+pick(gestures)+' '+pick(places)+'.';}])();}
function heart(source){const a=document.createElement('a');a.textContent='♥︎';a.href=source.url;a.target='_blank';a.rel='noopener noreferrer';a.title=`${source.title} — ${source.author}`;a.setAttribute('aria-label',`Reference: ${source.title} by ${source.author}`);return a;}
function newPassage(manual=true){
 if(manual)refreshClouds();
 clearInterval(timer);clearTimeout(continuation);
 const oldLayers=[...stage.querySelectorAll('.text-layer')];
 oldLayers.forEach(old=>{old.setAttribute('aria-hidden','true');old.querySelectorAll('a').forEach(a=>a.tabIndex=-1);old.classList.add('archived');if(manual){old.classList.add('fading');setTimeout(()=>old.remove(),800);}});
 if(!manual){while(oldLayers.length>=8)oldLayers.shift().remove();oldLayers.forEach((old,i)=>old.style.opacity=String(.16+.45*(i+1)/oldLayers.length));}

 let index;do{index=Math.floor(Math.random()*sources.length)}while(index===lastSource);lastSource=index;const source=sources[index];
 const font=chooseFont();
 const layer=document.createElement('section');layer.className='text-layer '+font.kind;layer.style.fontFamily=`'${font.name}', ${font.kind==='pixel'?'monospace':'cursive'}`;
 layer.style.transform=`rotate(${(Math.random()*.9+.25)*(Math.random()<.5?-1:1)}deg)`;
 layer.setAttribute('aria-label','Original generative writing, inspired by '+source.title);stage.append(layer);current=layer;
 const style=getComputedStyle(layer),lineHeight=parseFloat(style.lineHeight);
 const shapeWidth=Math.min(layer.clientWidth*.96,layer.clientHeight*1.12),shapeHeight=shapeWidth*.9;
 const offsetX=(layer.clientWidth-shapeWidth)/2,offsetY=(layer.clientHeight-shapeHeight)/2;
 // Scan a heart outline into text spans; the top rows have two separate lobes.
 const outline=Array.from({length:720},(_,i)=>{const t=i/720*Math.PI*2;return{x:(16*Math.sin(t)**3+16)/32*shapeWidth,y:(12-(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t)))/29*shapeHeight};});
 function intervals(y){const cuts=[];for(let i=0;i<outline.length;i++){const a=outline[i],b=outline[(i+1)%outline.length];if((a.y<=y&&b.y>y)||(b.y<=y&&a.y>y))cuts.push(a.x+(y-a.y)/(b.y-a.y)*(b.x-a.x));}cuts.sort((a,b)=>a-b);const result=[];for(let i=0;i+1<cuts.length;i+=2)result.push([cuts[i],cuts[i+1]]);return result;}
 const slots=[];
 for(let y=0;y+lineHeight<shapeHeight;y+=lineHeight){
  const middle=intervals(y+lineHeight*.5);
  for(const [left,right] of middle){
   // Insets at top and bottom keep the full letters inside the heart.
   let lo=left,hi=right;
   for(const sample of [y+lineHeight*.15,y+lineHeight*.9]){const match=intervals(sample).find(([a,b])=>a<right&&b>left);if(match){lo=Math.max(lo,match[0]);hi=Math.min(hi,match[1]);}else hi=lo;}
   if(hi-lo>24)slots.push({left:offsetX+lo+3,top:offsetY+y,width:hi-lo-6});
  }
 }
 const probe=document.createElement('span');probe.className='probe';layer.append(probe);
 const link=heart(source);probe.append(link);const heartWidth=probe.getBoundingClientRect().width+10;probe.replaceChildren();
 let pending=[],previous='';const lines=[];
 for(let n=0;n<slots.length;n++){
  const slot=slots[n];let text='',attempts=0;const limit=slot.width-(n===slots.length-1?heartWidth:0);
  while(attempts++<300){if(!pending.length){let next=sentence(source);if(next===previous)next=sentence(source);previous=next;pending=next.split(' ');}
   const candidate=text+(text?' ':'')+pending[0];probe.textContent=candidate;
   if(probe.getBoundingClientRect().width>limit)break;
   text=candidate;pending.shift();
  }
  if(!text&&n!==slots.length-1)continue;
  const line=document.createElement('span');line.className='text-line';line.style.top=slot.top+'px';line.style.left=slot.left+'px';line.style.width=slot.width+'px';line.style.textAlign='center';layer.append(line);lines.push({node:line,text});
 }
 probe.remove();let row=0,char=0;
 function write(){if(current!==layer)return;const item=lines[row];char+=3;item.node.textContent=item.text.slice(0,char);if(char>=item.text.length){row++;char=0;if(row===lines.length){clearInterval(timer);item.node.append(' ',heart(source));continuation=setTimeout(()=>newPassage(false),1200);}}}
 if(reduced.matches){lines.forEach(item=>item.node.textContent=item.text);lines.at(-1).node.append(' ',heart(source));continuation=setTimeout(()=>newPassage(false),12000);}else timer=setInterval(write,24);
}
function refreshClouds(){
 cloudLayer.getAnimations({subtree:true}).forEach(a=>a.cancel());cloudLayer.replaceChildren();
 const cloudCount=5;
 const band=(innerHeight-30)/cloudCount;
 const occupied=[];
 for(let i=0;i<cloudCount;i++){
  const art=document.createElement('div');art.className='heart-cloud';
  const cols=66,rows=28,phase=Math.random()*6;
  const lobes=[{x:9,y:8,rx:6+Math.random(),ry:3.4+Math.random()*.8},{x:14+Math.random()*2,y:5.2+Math.random(),rx:5+Math.random(),ry:3.8+Math.random()*.7},{x:21+Math.random()*2,y:6.5+Math.random(),rx:5+Math.random(),ry:3.5+Math.random()*.8},{x:27,y:9,rx:4+Math.random()*.6,ry:2.7+Math.random()*.5},{x:17,y:10,rx:12+Math.random(),ry:2.5+Math.random()*.4}];
  for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){
   const cell=document.createElement('span'),wx=x/2+Math.sin(y*.25+phase)*.35,wy=y/2+Math.sin(x*.19+phase)*.3;
   if(lobes.some(l=>((wx-l.x)/l.rx)**2+((wy-l.y)/l.ry)**2<=1))cell.textContent=pick(['♥︎','♥︎','✴','✴','✧','·']);art.append(cell);
  }
  const width=Math.min(innerWidth*.8,band*.85/.42,720),height=width*.42;
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
  mote.style.fontSize=(7+Math.random()*9)+'px';mote.style.opacity=String(.16+Math.random()*.16);mote.style.transform=`rotate(${Math.random()*50-25}deg)`;cloudLayer.append(mote);
 }
}
stage.addEventListener('click',e=>{if(!e.target.closest('a'))newPassage();});
document.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();newPassage();}});
let resizeTimer;window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(newPassage,180);});
refreshClouds();Promise.allSettled(fonts.map(font=>document.fonts.load(`24px "${font.name}"`))).then(()=>newPassage());
