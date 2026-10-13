'use strict';
// Static conceptual illustrations. Actual IDW output is in atmosphere-demo.html.
const svgNS = 'http://www.w3.org/2000/svg';
const grid = document.getElementById('volume-grid');
const points = document.getElementById('volume-points');
function svgElement(tag, attrs, parent) {
  const element = document.createElementNS(svgNS, tag);
  for (const [key, value] of Object.entries(attrs)) element.setAttribute(key, value);
  parent.appendChild(element);
}
for (let i = 1; i < 7; i++) {
  const t = i / 7;
  svgElement('path', {d:`M110 ${160+232*t} L335 ${253+233*t} L565 ${165+230*t}`,fill:'none'}, grid);
  svgElement('path', {d:`M${110+230*t} ${160-90*t} L${110+230*t} ${392-91*t} L${335+230*t} ${486-91*t}`,fill:'none'},grid);
  svgElement('path', {d:`M${340+225*t} ${70+95*t} L${340+225*t} ${301+94*t} L${110+225*t} ${392+94*t}`,fill:'none'},grid);
}
for(let z=0;z<6;z++) for(let x=0;x<6;x++) for(let y=0;y<6;y++) {
  const px = 340 + (x-2.5)*35 - (y-2.5)*35;
  const py = 302 + (x-2.5)*14 + (y-2.5)*14 - z*30;
  svgElement('circle',{cx:px,cy:py,r:1.6,fill:z<3?'#8ba873':'#74a398',opacity:.3},points);
}
const fields = {
  temperature:{name:'온도',title:'공간 속의 온도 변화',detail:'흩어진 관측점 사이의 온도를 거리 역가중으로 추정합니다. 온도 보간의 거리 지수는 p=1.5입니다.',colors:['#46bcc4','#d5ed95','#edbd76']},
  humidity:{name:'습도',title:'대기 속 수분의 분포',detail:'서로 다른 궤적에서 얻은 상대습도를 공간으로 연결합니다. 습도 보간의 거리 지수는 p=1.5입니다.',colors:['#8583c3','#68b1cd','#b9e5c5']},
  pressure:{name:'기압',title:'고도 변화 너머의 기압',detail:'고도에 따른 기본 기압을 제거한 잔차를 보간하고, 예측 위치의 기준 기압을 다시 더합니다. 거리 지수는 p=1.5입니다.',colors:['#6987bc','#80bca9','#dde99b']},
  gas:{name:'가스 저항',title:'국소적인 가스 저항의 변화',detail:'가스 저항은 p=2.5로 가까운 표본의 영향을 더 크게 반영합니다. 이 값은 보정된 VOC 농도(ppm)가 아닙니다.',colors:['#639fa3','#baa2cd','#e8c68f']}
};
let selectedField = 'temperature';
const canvas = document.getElementById('field-canvas');
const ctx = canvas.getContext('2d');
function mixColor(stops,t){
  const segment=t<.5?0:1;const fraction=segment===0?t*2:(t-.5)*2;
  const decode=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
  const a=decode(stops[segment]),b=decode(stops[segment+1]);
  return a.map((v,i)=>Math.round(v+(b[i]-v)*fraction)).join(',');
}
function drawField(){
  if(!ctx)return;
  const w=canvas.clientWidth,h=canvas.clientHeight,dpr=Math.min(window.devicePixelRatio||1,2);
  if(!w||!h)return;
  canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
  const size=Math.min(w*.34,h*.61);
  const project=(x,y,z)=>[w*.5+(x-y)*size*.8,h*.72+(x+y)*size*.32-z*size];
  const line=(a,b,color,width=1)=>{ctx.beginPath();ctx.moveTo(...project(...a));ctx.lineTo(...project(...b));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();};
  for(let i=0;i<=6;i++){
    const t=i/6;line([t,0,0],[t,1,0],'#38505a');line([0,t,0],[1,t,0],'#38505a');
    line([0,1,t],[1,1,t],'#2c434d');line([1,0,t],[1,1,t],'#2c434d');
  }
  for(const [a,b] of [[[0,0,0],[0,0,1]],[[1,0,0],[1,0,1]],[[1,1,0],[1,1,1]],[[0,1,0],[0,1,1]],[[0,0,1],[1,0,1]],[[0,0,1],[0,1,1]],[[1,0,1],[1,1,1]],[[0,1,1],[1,1,1]]])line(a,b,'#536972');
  const dots=[];
  for(let z=0;z<12;z++)for(let x=0;x<12;x++)for(let y=0;y<12;y++){
    const nx=x/11,ny=y/11,nz=z/11;
    let value=.52+.28*Math.sin(nx*3+ny*2-nz*2);
    if(selectedField==='humidity')value=.52+.28*Math.sin(nx*4-ny*3+nz*2);
    if(selectedField==='pressure')value=1-nz*.8;
    if(selectedField==='gas')value=.17+.8*Math.exp(-((nx-.62)**2+(ny-.4)**2+(nz-.55)**2)*8);
    dots.push({p:project(nx,ny,nz),value:Math.max(0,Math.min(1,value)),depth:nx+ny});
  }
  dots.sort((a,b)=>b.depth-a.depth);
  for(const dot of dots){ctx.beginPath();ctx.arc(dot.p[0],dot.p[1],1.8,0,Math.PI*2);ctx.fillStyle=`rgba(${mixColor(fields[selectedField].colors,dot.value)},.48)`;ctx.fill();}
  for(let node=0;node<3;node++){
    ctx.beginPath();
    for(let i=0;i<=45;i++){const t=i/45,x=.22+node*.23+.08*Math.sin(t*9+node),y=.3+node*.13+.07*Math.cos(t*8+node),p=project(x,y,1-t);i?ctx.lineTo(...p):ctx.moveTo(...p);}
    ctx.strokeStyle=['#e4efc6','#65cdbe','#d3b5df'][node];ctx.lineWidth=2;ctx.stroke();
  }
  ctx.font='9px monospace';ctx.fillStyle='#a7bec4';
  const east=project(1,0,0),north=project(0,1,0),altitude=project(0,0,1);
  ctx.fillText('EAST →',east[0]-10,east[1]+20);ctx.fillText('← NORTH',north[0]-45,north[1]+20);ctx.fillText('ALTITUDE',altitude[0]-24,altitude[1]-15);
}
for(const button of document.querySelectorAll('.field-button'))button.addEventListener('click',()=>{
  selectedField=button.dataset.field;const field=fields[selectedField];
  for(const other of document.querySelectorAll('.field-button')){const active=other===button;other.classList.toggle('active',active);other.setAttribute('aria-pressed',String(active));}
  document.getElementById('field-title').textContent=field.title;document.getElementById('field-detail').textContent=field.detail;
  document.getElementById('scale-low').textContent=`낮은 ${field.name}`;document.getElementById('scale-high').textContent=`높은 ${field.name}`;
  document.getElementById('scale-gradient').style.background=`linear-gradient(90deg,${field.colors.join(',')})`;
  canvas.setAttribute('aria-label',`${field.name}의 가상 3차원 분포 개념도`);drawField();
});
if('ResizeObserver' in window)new ResizeObserver(drawField).observe(canvas);else window.addEventListener('resize',drawField);
drawField();
